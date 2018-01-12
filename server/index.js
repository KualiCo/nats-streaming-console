const _http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const { proxy } = require('./proxy-proxy')
const { getServerOptions, setServerOptions } = require('./routes/server')
const { channelMessageList } = require('./routes/channel-message')
const { Bridge } = require('./events/nats-to-socketio')
const { options } = require('./nats-ss')

// SETUP APPLICATION SERVER
const app = express()
const http = _http.Server(app)
app.use(express.static('build'))
app.use('/streaming', proxy)
app.get('/api/server', getServerOptions)
app.post('/api/server', bodyParser.json(), setServerOptions)
app.get('/api/channel/:channel/message', channelMessageList)
app.get('*', (req, res) => {
  res.status(404).send('Not here.')
})

// SETUP WEB SOCKETS
const io = socketio(http)
io.on('connection', client => {
  const clientMessageBridge = new Bridge(client)
  client.on('subscribe-to-channel', data => {
    clientMessageBridge.subscribeToChannel(data)
  })
  client.on('unsubscribe-from-channel', data => {
    clientMessageBridge.unsubscribeFromChannel(data)
  })
})

// START SERVER
const server = http.listen(8282, () => {
  var host = server.address().address
  var port = server.address().port
  console.log(`Example app listening at http://${host}:${port}`)
})
