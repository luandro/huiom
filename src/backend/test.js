const pull = require('pull-stream')
// const pullParaMap = require('pull-paramap')
const { threadWithImage } = require('./utils')

module.exports = sbot => {
  console.log('WHOAMI', sbot.whoami())
  console.log('Publishing')
  const testType = 'audio-test-97'
  const contentRoot = {
    type: 'test',
    type: testType
  }
  sbot.publish(contentRoot, (err, valueRoot) => {
    const contentBranch = {
      type: 'test',
      type: testType,
      root: valueRoot.key,
      branch: valueRoot.key
    }
    sbot.publish(contentBranch, (err, valueBranch) => {
      // console.log('Pubished', valueBranch)
      pull(
        // sbot.messagesByType({ type: testType, reverse: true }),
        // sbot.threads.public({
        //   limit: 100, // how many threads at most
        //   reverse: true, // threads sorted from most recent to least recent
        //   allowlist: [testType]
        // }),
        sbot.threads.thread({
          limit: 100,
          root: valueRoot.key,
          allowlist: [testType]
        }),
        pull.asyncMap(threadWithImage(sbot)),
        pull.take(100),
        pull.collect((err, threads) => {
          if (err) return console.error(err)
          console.log('0-0000-----------000', threads[0])
          // threads[0].map((t, key) => console.log(key, t.value.content))
        })
      )
    })
  })
}
