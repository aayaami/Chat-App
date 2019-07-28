const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

require('dotenv').config()

const app = express()

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useCreateIndex: true },
  () => {
    console.log('Connected to mongodb')
  }
)

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users/', require('./routes/api/users'))
app.use('/api/auth/', require('./routes/api/auth'))
app.use('/api/chats/', require('./routes/api/chats'))

// Server static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const port = 5000

const server = app.listen(process.env.PORT || port, () =>
  console.log(`Server started on port ${port}`)
)

const io = require('socket.io')(server)

io.on('connection', socket => {
  console.log(`socket ${socket.id} opened connection`)

  socket.on('join chat', id => {
    socket.join(id)
    console.log(`socket joined chat ${id}`)
  })

  socket.on('update messages', id => {
    io.to(id).emit('refresh messages')
  })

  socket.on('leave chat', id => {
    socket.leave(id)
    console.log(`socket left chat ${id}`)
  })

  socket.on('update chat', id => {
    io.to(id).emit('refresh chat')
  })

  socket.on('update chatlist', () => {
    console.log('update')
    io.emit('refresh chatlist')
  })

  socket.on('update chats', id => {
    console.log(`update ${id} chats`)
    io.to(id).emit('refresh chats')
  })

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} closed connection`)
  })
})
