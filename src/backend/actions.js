const bridge = require('rn-bridge')
const pull = require('pull-stream')
const pullFile = require('pull-file')
const pullParaMap = require('pull-paramap')
const fs = require('fs')
const { isAudio } = require('ssb-audio-schema')
const toUrl = require('ssb-serve-blobs/id-to-url')
const { commit, getImage, getName, threadWithExtras } = require('./utils')

// const getAccFile = filePath => filePath.split('.opus')[0] + '.aac'

module.exports = (sbot, appDataDir) => {
  sbot.conn.start() // is this needed?
  sbot.lan.start() // is this needed?

  console.log('SSB: react-native api starting ///////////')

  bridge.channel.on('action', ({ type, payload }) => {
    console.log('Got action', type, payload)
    switch (type) {
      case 'publishAudioFile':
        let { filePath, duration, size, root, branch } = payload
        if (isNaN(size)) {
          size = fs.statSync(filePath).size
        }

        pull(
          pullFile(filePath, {}),
          sbot.blobs.add((err, hash) => {
            if (err) return console.error('SSB:', err)

            const content = {
              type: 'audio',
              blob: hash, // the hash-id of the blob
              format: 'acc',
              duration,
              size,
              root,
              branch
            }
            sbot.publish(content, (err, value) => {
              fs.unlink(filePath, err => console.log('SSB: unlink', err))
              // fs.unlink(getAccFile(filePath), err => {
              //   if (err) throw err
              //   console.log('successfully deleted ', getAccFile(filePath))
              // })

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
        // fs.unlink(getAccFile(payload.filePath), err =>
        //   console.log('SSB: unlink', err)
        // )
        break

      case 'getFeed':
        if (payload) {
          pull(
            sbot.threads.thread({
              root: payload,
              allowlist: ['audio']
            }),
            pull.asyncMap(threadWithExtras(sbot)),
            pull.collect((err, data) => {
              if (err) return console.error(err)
              console.log('DATA =====>', data)
              commit({ type: 'feed', payload: data })
            })
          )
        } else {
          pull(
            sbot.threads.public({
              limit: 100,
              reverse: true,
              allowlist: ['audio']
            }),
            pull.asyncMap(threadWithExtras(sbot)),
            pull.collect((err, data) => {
              if (err) return console.error(err)
              console.log('DATA =====>', data)
              commit({ type: 'feed', payload: data })
            })
          )
        }
        break

      case 'whoami':
        getName(sbot, sbot.id, (nameErr, name) => {
          if (nameErr) return console.error('ssb:', nameErr)
          getImage(sbot, sbot.id, (imageErr, image) => {
            if (imageErr) return cb(imageErr)
            commit({
              type: 'whoami',
              payload: {
                feedId: sbot.id,
                name,
                image: image ? toUrl(image) : null
              }
            })
          })
        })
        break
      case 'about':
        getName(sbot, payload, (nameErr, name) => {
          if (nameErr) return console.error('ssb:', nameErr)
          getImage(sbot, payload, (imageErr, image) => {
            if (imageErr) return cb(imageErr)
            commit({
              type: 'about',
              payload: {
                name,
                image: image ? toUrl(image) : null
              }
            })
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
        let profileMsg = { type: 'about', about: sbot.id, name, image }
        if (image) {
          pull(
            pullFile(image, {}),
            sbot.blobs.add((err, hash) => {
              if (err) return console.error('SSB:', err)
              profileMsg.image = hash
              if (!name) {
                getName(sbot, sbot.id, (nameErr, idName) => {
                  if (nameErr) return console.error('ssb:', nameErr)
                  profileMsg.name = idName
                })
              }

              sbot.publish(profileMsg, (err, value) => {
                if (err) return console.error(err)
                console.log('Published', value)

                commit({
                  type: 'whoami',
                  payload: {
                    feedId: sbot.id,
                    name: name || profileMsg.name,
                    image: toUrl(hash)
                  }
                })
              })
            })
          )
        } else {
          sbot.publish(profileMsg, (err, value) => {
            if (err) return console.error(err)
            getImage(sbot, sbot.id, (imageErr, idImage) => {
              if (imageErr) return cb(imageErr)
              commit({
                type: 'whoami',
                payload: {
                  feedId: sbot.id,
                  name,
                  image: toUrl(idImage)
                }
              })
            })
          })
        }
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
