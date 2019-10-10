const bridge = require('rn-bridge')
const pull = require('pull-stream')
const pullFile = require('pull-file')
const pullParaMap = require('pull-paramap')
const fs = require('fs')
const { isAudio } = require('ssb-audio-schema')
const toUrl = require('ssb-serve-blobs/id-to-url')
const { commit, getImage, getName } = require('./utils')

const getAccFile = filePath => filePath.split('.opus')[0] + '.aac'

module.exports = (sbot, appDataDir) => {
  sbot.conn.start() // is this needed?
  sbot.lan.start() // is this needed?

  console.log('SSB: react-native api starting ///////////')

  bridge.channel.on('action', ({ type, payload }) => {
    console.log('Got action', type, payload)
    switch (type) {
      case 'publishAudioFile':
        var { filePath, duration, size } = payload
        if (isNaN(size)) {
          size = fs.statSync(filePath).size
        }

        pull(
          pullFile(filePath, {}),
          sbot.blobs.add((err, hash) => {
            if (err) return console.error('SSB:', err)

            var content = {
              type: 'audio',
              blob: hash, // the hash-id of the blob
              format: 'opus',
              duration,
              size
            }
            sbot.publish(content, (err, value) => {
              fs.unlink(filePath, err => console.log('SSB: unlink', err))
              fs.unlink(getAccFile(filePath), err => {
                if (err) throw err
                console.log('successfully deleted ', getAccFile(filePath))
              })

              if (err) return console.error(err)
              console.log('Published', value)

              commit({
                type: 'newAudioFile',
                payload: value
              })
            })
          })
        )
        break

      case 'deleteAudioFile':
        fs.unlink(payload.filePath, err => console.log('SSB: unlink', err))
        fs.unlink(getAccFile(payload.filePath), err =>
          console.log('SSB: unlink', err)
        )
        break

      case 'getFeed':
        pull(
          sbot.messagesByType({ type: 'audio', reverse: true }),
          pull.filter(isAudio),
          pullParaMap(
            (msg, cb) => {
              getImage(sbot, msg.value.author, (err, image) => {
                if (err) return cb(err)

                msg.value.image = toUrl(image)
                cb(null, msg)
              })
            },
            4 // max number of parallel queries paraMap can do
          ),
          pull.take(100),
          pull.collect((err, data) => {
            if (err) return console.error(err)
            console.log('DATA =====>', data)
            commit({ type: 'feed', payload: data })
          })
        )
        break

      case 'whoami':
        getName(sbot, sbot.id, (err, name) => {
          if (err) return console.error('ssb:', err)

          commit({
            type: 'whoami',
            payload: {
              feedId: sbot.id,
              name
            }
          })
        })
        break

      case 'doFollow':
        var followMsg = { type: 'contact', contact: payload, following: true }
        sbot.publish(followMsg, (err, value) => {
          if (err) return console.error(err)

          commit({
            type: 'follow',
            payload: { source: sbot.id, dest: payload, following: true }
          })
        })
        break

      case 'setProfile':
        if (!payload) break
        const { name, image } = payload
        var profileMsg = { type: 'about', about: sbot.id, name, image }
        sbot.publish(profileMsg, (err, value) => {
          if (err) return console.error(err)

          commit({
            type: 'whoami',
            payload: {
              feedId: sbot.id,
              name,
              image
            }
          })
        })
        break

        // NOTE currently not needed because follow stimulates connection
        // case 'connect':
        //   sbot.conn.connect(payload)
        //   console.log('SSB: running connect', payload)
        //   break

        // NOTE we only care about whether you are connecting to someoone atm
        // case 'getFollow':
        //   var { source = sbot.id, dest } = payload
        //
        //   sbot.friends.isFollowing({ source, dest }, (err, following) => {
        //     if (err) return console.error(err)
        //
        //     commit({
        //       type: 'follow',
        //       payload: { source, dest, following: following || false }
        //     })
        //   })
        //   break

      default:
        console.log('SSB: unhandled msg, type =', type)
      //
    }
  })
}
