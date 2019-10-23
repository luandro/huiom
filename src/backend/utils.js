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
    if (msg.value.content.type === 'audio' && msg.value.content.blob) {
      msg.value.content.audio = toUrl(msg.value.content.blob)
    }
    if (msg.value.content.type === 'contact') {
      const contactImageOpts = { key: 'image', dest: msg.value.content.contact }
      const [error, contactImage] = await runAsync(getAbout)(contactImageOpts)
      if (error) return cb(error)
      msg.value.content.contactImage = contactImage ? toUrl(contactImage) : null
    }
    const imageOpts = { key: 'image', dest: msg.value.author }
    const [error, image] = await runAsync(getAbout)(imageOpts)
    if (error) return cb(error)
    msg.value.content.image = image ? toUrl(image) : null
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
  threadWithExtras: sbot => {
    return async (thread, cb) => {
      for (const msg of thread.messages) {
        await runAsync(mutateMsgWithExtras(sbot))(msg)
      }
      cb(null, thread)
    }
  }
}
