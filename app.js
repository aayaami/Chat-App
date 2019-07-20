const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true }, () => {
    console.log('Connected to mongodb')
})

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users/', require('./routes/api/users'))
app.use('/api/auth/', require('./routes/api/auth'))
app.use('/api/chats/', require('./routes/api/chats'))

const port = 5000

const server = app.listen(port, () => console.log(`Server started on port ${port}`))

const io = require('socket.io')(server)

io.on('connection', socket => {
    
    socket.on('join chat', (id) => {
        socket.join(id)
        console.log(`socket joined chat ${id}`)
    })

    socket.on('update messages', (id) => {
        io.to(id).emit('refresh messages')
    })

    
    socket.on('leave chat', (id) => {
        socket.leave(id)
        console.log(`socket left chat ${id}`)
    })
})