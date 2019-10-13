const toUrl = require('ssb-serve-blobs/id-to-url')

module.exports = {
  commit: mutation => {
    // used for sending mutations to front end state machines
    // mutation should be of form { type, payload? }
    if (!process.env.DESKTOP) {
      const bridge = require('rn-bridge')
      bridge.channel.post('mutation', mutation)
    }
  },
  getImage: (sbot, feedId, cb) => {
    return sbot.about.socialValue({ key: 'image', dest: feedId }, cb)
  },
  getName: (sbot, feedId, cb) => {
    return sbot.about.socialValue({ key: 'name', dest: feedId }, cb)
  },
  threadWithImage: sbot => {
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
        console.log('FUCK', i)
        cb(null, newList)
      })
    }
  }
}
