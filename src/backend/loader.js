const os = require('os')
const path = require('path')

// Set default directory
if (!process.env.DESKTOP) {
  const rnBridge = require('rn-bridge')
  const nodejsProjectDir = path.resolve(
    rnBridge.app.datadir(),
    'nodejs-project'
  )
  os.homedir = () => nodejsProjectDir
  process.cwd = () => nodejsProjectDir
  // Force libsodium to use a WebAssembly implementation
}

process.env = process.env || {}
process.env.CHLORIDE_JS = 'yes'

require('./server')
