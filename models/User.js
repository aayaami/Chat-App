const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userChats: [
        {
            chat: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'chats'
            }
        }
    ],
    invitesToChats: [
        {
            chat: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'chats'
            }
        }
    ]
})

module.exports = User = mongoose.model('user', UserSchema)