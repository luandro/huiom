const pull = require('pull-stream')
const pullParaMap = require('pull-paramap')
const toUrl = require('ssb-serve-blobs/id-to-url')
const { commit, getImage } = require('./utils')

module.exports = sbot => {
  // Replication updates
  pull(
    sbot.replicate.changes(),
    pull.drain(data => {
      // console.log('CHANGES', data)
      commit({ type: 'replication', payload: data })
    })
  )

  // Peers we're connected / connecting / disconnecting from (current state)
  pull(
    sbot.conn.peers(),
    pull.asyncMap((peers, cb) => {
      // go through the peers array and fetches 'name' for each peer
      pull(
        pull.values(peers),
        pullParaMap(
          (peer, cb) => {
            getImage(sbot, peer[1].key, (err, image) => {
              if (err) return cb(err)
              peer[1].image = toUrl(image)
              cb(null, peer)
            })
          },
          4 // max number of parallel queries paraMap can do
        ),
        pull.collect((err, peers) => {
          if (err) cb(err)
          else cb(null, peers)
        })
      )
    }),
    pull.drain(
      data => commit({ type: 'connected-peers', payload: data }),
      err => console.error('ssb: err', err)
    )
  )

  // Peers we *could* trying connecting to
  // but haven't explicitly said we trust / want to connect to
  // NOTE - a follow signals "I trust enough to want to auto-connect"
  pull(
    sbot.conn.stagedPeers(),
    pull.drain(data => {
      commit({ type: 'staged-peers', payload: data })
    })
  )
}
