const { getInstance: getNerveInstance } = require('nats-nerve')

const defaults = {
  server: 'nats://localhost:4222',
  monitor: 'http://localhost:8222',
  cluster: 'test-cluster',
  appName: 'nats-streaming-console'
}

exports.options = Object.assign({}, defaults)
console.log({ options: exports.options })

exports.getNerveInstance = async () => {
  const { server, cluster, appName } = exports.options
  return getNerveInstance(server, cluster, appName)
}
