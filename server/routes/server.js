const axios = require('axios')
const { getNerveInstance, options } = require('../nats-ss')

exports.getServerOptions = async (req, res) => {
  res.status(200).send(options)
}

exports.setServerOptions = async (req, res) => {
  const { host, port, monitoringPort } = req.body
  try {
    const data = await axios
      .get(`http://${host}:${monitoringPort}/streaming/serverz`)
      .then(resp => resp.data)
    options.server = `nats://${host}:${port}`,
    options.monitor = `http://${host}:${monitoringPort}`,
    options.cluster = data.cluster_id
    res.status(200).send({ options, data })
  } catch (err) {
    res.status(500).send({ status: 'error' })
  }
}
