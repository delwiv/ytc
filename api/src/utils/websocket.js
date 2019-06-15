import socketIo from 'socket.io'

export default server => {
  const io = socketIo(server)
  io.on('connection', socket => {
    console.log('io connected', socket.id)
    socket.on('message', data => {
      console.log('got message', { data })
    })
  })
}
