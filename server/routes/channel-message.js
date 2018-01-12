const Promise = require('bluebird')
const { getNerveInstance } = require('../nats-ss')

exports.channelMessageList = async (req, res) => {
  try {
    const { channel } = req.params
    const nerve = await getNerveInstance()
    const opts = { startAtSequence: 10 }
    let count = 0
    const messages = []
    const disposer = getNerveSubscription(nerve, channel, opts, msg => {
      messages.push({ 
        sequence: msg.getSequence(),
        timestamp: msg.getTimestamp(),
        subject: msg.getSubject(),
        data: msg.getData()
      })
    })
    Promise.using(disposer, async subscription => {
      await Promise.delay(1000)
      res.send(messages)
    })
  } catch(err) {
    console.log({ err })
    res.status(500).send(err)
  }
}

function getNerveSubscription (nerve, channel, opts, fn) {
  return Promise.resolve(nerve.subscribe(channel, opts, fn))
    .disposer(subscription => {
      return new Promise((resolve, reject) => {
        subscription.unsubscribe()
        subscription.on('unsubscribed', () => {
          resolve()
        })
      })
    })
}