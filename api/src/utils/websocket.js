import socketIo from 'socket.io'
import redis from '../lib/redis.js'

export default server => {
  const io = socketIo(server)
  io.on('connection', socket => {
    socket.on('registerUser', async ({ userId }) => {
      await redis.set(userId, socket.id)
      console.log('got user', userId)
    })
  })
  return {
    emit: async (event, userId, data) => {
      const socketId = await redis.get(userId)
      if (io.sockets.sockets[socketId]) {
        io.sockets.sockets[socketId].emit(event, data)
      }
    },
  }
}
