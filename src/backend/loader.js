const os = require('os')
const path = require('path')
const { commit } = require('./utils')

// Set default directory
if (!process.env.DESKTOP) {
  const rnBridge = require('rn-bridge')
  const nodejsProjectDir = path.resolve(
    rnBridge.app.datadir(),
    'nodejs-project'
  )
  os.homedir = () => nodejsProjectDir
  process.cwd = () => nodejsProjectDir
}

// Force libsodium to use a WebAssembly implementation
process.env = process.env || {}
process.env.CHLORIDE_JS = 'yes'

// Report JS backend crashes to Java, and in turn, to ACRA
process.on('uncaughtException', err => {
  if (typeof err === 'string') {
    commit({
      type: 'exception',
      payload: 'uncaughtException ' + err
    })
  } else {
    commit({
      type: 'exception',
      payload: 'uncaughtException ' + err.message + '\n' + err.stack
    })
  }
  setTimeout(() => {
    process.exit(1)
  })
})
const _removeAllListeners = process.removeAllListeners
process.removeAllListeners = function removeAllListeners (eventName) {
  if (eventName !== 'uncaughtException') {
    return _removeAllListeners.call(this, eventName)
  }
  return process
}

require('./server')
