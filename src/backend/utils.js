const toUrl = require('ssb-serve-blobs/id-to-url')
const runAsync = require('promisify-tuple')

const getImage = (sbot, feedId, cb) => {
  return sbot.about.socialValue({ key: 'image', dest: feedId }, cb)
}

const getName = (sbot, feedId, cb) => {
  return sbot.about.socialValue({ key: 'name', dest: feedId }, cb)
}

const mutateMsgWithExtras = sbot => {
  const getAbout = sbot.about.socialValue
  return async (msg, cb) => {
    const nameOpts = { key: 'media', dest: msg.value.author }
    const [e1, image] = await runAsync(getAbout)(nameOpts)
    if (e1) return cb(e1)
    msg.value.content.image = toUrl(image)
    console.log('REsolving with img', msg)
    cb(null, msg)
  }
}

module.exports = {
  commit: mutation => {
    // used for sending mutations to front end state machines
    // mutation should be of form { type, payload? }
    if (!process.env.DESKTOP) {
      const bridge = require('rn-bridge')
      bridge.channel.post('mutation', mutation)
    }
  },
  getImage,
  getName,
  threadWithImage2: sbot => {
    return async function (thread, cb) {
      let newList = {
        messages: []
      }
      Promise.all(
        thread.messages.map((msg, k) =>
          sbot.about.socialValue(
            { key: 'image', dest: msg.value.author },
            (err, image) => {
              console.log('TCL: image', image)
              if (err) return cb(err)
              msg.value.content.image = toUrl(image)
              return newList.messages.push(msg)
            }
          )
        )
      ).then(i => {
        console.log('FINISHED', i)
        cb(null, newList)
      })
    }
  },
  threadWithImage: sbot => {
    return async (thread, cb) => {
      for (const msg of thread.messages) {
        await runAsync(mutateMsgWithExtras(sbot))(msg)
      }
      cb(null, thread)
    }
  }
}
