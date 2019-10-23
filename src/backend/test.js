const pull = require('pull-stream')
// const pullParaMap = require('pull-paramap')
const { getImage, threadWithExtras } = require('./utils')
const toUrl = require('ssb-serve-blobs/id-to-url')

module.exports = sbot => {
  console.log('WHOAMI', sbot.whoami())
  console.log('Publishing')
  const testType = 'audio-test-97'
  const contentRoot = {
    type: testType
  }
  sbot.publish(contentRoot, (err, valueRoot) => {
    const contentBranch = {
      type: testType,
      root: valueRoot.key,
      branch: valueRoot.key
    }
    sbot.publish(contentBranch, (err, valueBranch) => {
      // console.log('Pubished', valueBranch)
      let newList = {
        messages: []
      }
      pull(
        // sbot.messagesByType({ type: testType, reverse: true }),
        sbot.threads.public({
          limit: 100, // how many threads at most
          reverse: true, // threads sorted from most recent to least recent
          allowlist: [testType]
        }),
        // sbot.threads.thread({
        //   limit: 100,
        //   root: valueRoot.key,
        //   allowlist: [testType]
        // }),
        pull.asyncMap(threadWithExtras(sbot)),
        pull.take(1),
        pull.collect(async (err, threads) => {
          if (err) return console.error(err)
          console.log('Done 0-0000-----------000', threads[0].messages[0])
        })
      )
    })
  })
}
