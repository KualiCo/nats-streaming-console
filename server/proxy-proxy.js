const proxy = require('http-proxy-middleware')
const { options } = require('./nats-ss')

const proxies = {}

exports.proxy = (req, res, next) => {
  if (!proxies[options.monitor]) {
    proxies[options.monitor] = proxy('/streaming', {
      target: options.monitor,
      ws: true
    })
  }
  proxies[options.monitor](req, res, next)
}
