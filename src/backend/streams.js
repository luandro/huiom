const bridge = require('rn-bridge')
const pull = require('pull-stream')
const pullParaMap = require('pull-paramap')

module.exports = sbot => {
  // Replication updates
  pull(
    sbot.replicate.changes(),
    pull.drain(data => {
      console.log('CHANGES', data)
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
            getName(peer[1].key, (err, name) => {
              if (err) return cb(err)

              peer[1].name = name
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

  function getName (feedId, cb) {
    sbot.about.socialValue({ key: 'name', dest: feedId }, cb)
  }
}

function commit (mutation) {
  // mutation should be of form { type, payload? }
  bridge.channel.post('mutation', mutation)
}
// used for sending mutations to front end state machines
