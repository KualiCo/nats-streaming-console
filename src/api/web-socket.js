import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8282')

export const subscribeToChannel = (channel, opts, cb) => {
  socket.on(channel, message => cb(message))
  socket.emit('subscribe-to-channel', { channel, opts })
}
