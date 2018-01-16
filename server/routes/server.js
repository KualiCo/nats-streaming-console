const axios = require('axios')
const { getNerveInstance, options } = require('../nats-ss')

exports.getServerOptions = async (req, res) => {
  res.status(200).send(options)
}

exports.setServerOptions = async (req, res) => {
  const { host, port, monitoringPort } = req.body
  try {
    const resp = await axios({
      method: 'get',
      baseURL: `http://${host}:${monitoringPort}/`,
      url: '/streaming/serverz',
      headers: { 'Accept': 'application/json' },
      proxy: false
    })
    updateOptions(resp.data, host, port, monitoringPort)
    res.status(200).send({ options, data: resp.data })
  } catch (err) {
    console.log({ err })
    res.status(500).send({ status: 'error' })
  }
}

function updateOptions(data, host, port, monitoringPort) {
  options.server = `nats://${host}:${port}`,
  options.monitor = `http://${host}:${monitoringPort}`,
  options.cluster = data.cluster_id
}
