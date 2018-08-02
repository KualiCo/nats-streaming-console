const { getInstance: getNerveInstance } = require('nats-nerve')

const defaults = {
  server: process.env.STAN_URL || 'nats://localhost:4222',
  monitor: process.env.STAN_MONITOR_URL || 'http://localhost:8222',
  cluster: process.env.STAN_CLUSTER || 'test-cluster',
  appName: 'nats-streaming-console'
}

exports.options = Object.assign({}, defaults)
console.log({ options: exports.options })

exports.getNerveInstance = async () => {
  const { server, cluster, appName } = exports.options
  return getNerveInstance(server, cluster, appName)
}
