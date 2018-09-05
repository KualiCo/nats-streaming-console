import openSocket from 'socket.io-client'
const socket = openSocket('/')

export const subscribeToChannel = (channel, opts, cb) => {
  socket.on(channel, message => cb(message))
  socket.emit('subscribe-to-channel', { channel, opts })
}
