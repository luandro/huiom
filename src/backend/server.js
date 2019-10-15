const path = require('path')
const ssbKeys = require('ssb-keys')
const mkdirp = require('mkdirp')
const caps = require('ssb-caps')
const Config = require('ssb-config/inject')
const fs = require('fs')
// const rnBridge = require('rn-bridge')
// const rnChannelPlugin = require('multiserver-rn-channel')
// const NoauthTransformPlugin = require('multiserver/plugins/noauth')
let appDataDir

if (!process.env.DESKTOP) {
  const bridge = require('rn-bridge')
  appDataDir = bridge.app.datadir()
} else {
  appDataDir = '/tmp/.ssb-test/'
}

const ssbPath = path.resolve(appDataDir, '.ssb')
if (!fs.existsSync(ssbPath)) mkdirp.sync(ssbPath)
const keys = ssbKeys.loadOrCreateSync(path.join(ssbPath, '/secret'))

const capsHash = 'S4nNh0ZvAvjbY1ziZEHMXawbCEIM6qwjCDmf0ResT/s='

const config = (() => {
  const NET_PORT = 26831
  const appName = 'ssb'

  return Config(appName, {
    path: ssbPath,
    keys,
    connections: {
      incoming: {
        net: [{ scope: 'private', transform: 'shs', port: NET_PORT }],
        channel: [{ scope: 'device', transform: 'noauth' }]
      },
      outgoing: {
        net: [{ transform: 'shs' }],
        ws: [{ transform: 'shs' }]
      }
    },
    friends: {
      hops: 2
    },
    caps: { shs: Buffer.from(capsHash, 'base64') }
  })
})()

// function rnChannelTransport (ssb) {
//   ssb.multiserver.transport({
//     name: 'channel',
//     create: () => rnChannelPlugin(rnBridge.channel)
//   })
// }

// function noAuthTransform (ssb, cfg) {
//   ssb.multiserver.transform({
//     name: 'noauth',
//     create: () =>
//       NoauthTransformPlugin({
//         keys: { publicKey: Buffer.from(cfg.keys.public, 'base64') }
//       })
//   })
// }

const ssConfig = { caps: { shs: Buffer.from(capsHash, 'base64') } }

const sbot = require('secret-stack')(ssConfig) // eslint-disable-line
  .use(require('ssb-db'))
  .use(require('ssb-conn'))
  .use(require('ssb-lan'))
  .use(require('ssb-replicate')) // must be loaded before ssb-friends
  .use(require('ssb-friends'))
  .use(require('ssb-blobs'))
  .use(require('ssb-promiscuous'))
  .use(require('ssb-serve-blobs'))
  .use(require('ssb-backlinks'))
  .use(require('ssb-about'))
  .use(require('ssb-threads'))
  .use(require('ssb-ebt'))
  .call(null, config)

if (!process.env.DESKTOP) {
  require('./actions')(sbot, appDataDir)
  require('./streams')(sbot, appDataDir)
  // NOTE could send a message to front-end saying "READY"
  // to tell UI it's sage to launch + start requesting things
} else {
  require('./test')(sbot)
}
