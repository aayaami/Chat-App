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

const port = 5000

app.listen(port, () => console.log(`Server started on port ${port}`))