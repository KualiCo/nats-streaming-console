const { getInstance: getNerveInstance } = require('nats-nerve')

const defaults = {
  server: process.env.STAN_URL,
  monitor: process.env.STAN_MONITOR_URL,
  cluster: process.env.STAN_CLUSTER,
  appName: 'nats-streaming-console'
}

exports.options = Object.assign({}, defaults)
console.log({ options: exports.options })

exports.getNerveInstance = async () => {
  const { server, cluster, appName } = exports.options
  return getNerveInstance(server, cluster, appName)
}
