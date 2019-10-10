const bridge = require('rn-bridge')

module.exports = {
  commit: mutation => {
    // used for sending mutations to front end state machines
    // mutation should be of form { type, payload? }
    bridge.channel.post('mutation', mutation)
  },
  getImage: (sbot, feedId, cb) => {
    sbot.about.socialValue({ key: 'image', dest: feedId }, cb)
  },
  getName: (sbot, feedId, cb) => {
    sbot.about.socialValue({ key: 'name', dest: feedId }, cb)
  }
}
