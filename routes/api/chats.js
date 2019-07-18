const router = require('express').Router()
const mongoose = require('mongoose')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Chat = require('../../models/Chat')



// @route   GET api/chats
// @desc    Get chats
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const chats = await Chat.find({}).select("name")

        if(!chats) {
            return res.status(400).json({ msg: 'No chats'})
        }

        res.json(chats)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   POST api/chats
// @desc    Make a new chat
// @access  Private
router.post('/', auth, [
    check('name', 'Name is required')
        .not()
        .isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name } = req.body

    try {
        const newChat = new Chat({
            name,
            messages: [],
            admins: [],
            users: []
        })

        newChat.admins.push({ user: req.user.id })
        newChat.users.push({ user: req.user.id, isMember: true })

        await newChat.save()

        res.json(newChat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/chats/joinrequest/:chat_id
// @desc    Make a join request
// @access  Private
router.put('/joinrequest/:chat_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let isMatch = await chat.users.map(user => user.user).indexOf(req.user.id)
        if(isMatch !== -1) {
            isMatch = 1
        }

        if(isMatch) {
            return res.status(400).json({ errors: [{msg: 'Join request already sent'}] })
        }

        chat.users.push({ user: req.user.id })

        await chat.save()

        res.json(chat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/chats/acceptrequest/:user_id
// @desc    Accept request
// @access  Private
router.put('/acceptrequest/:chat_id/:user_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let isMatchUser = await chat.users.map(user => user.user).indexOf(req.params.user_id)
        let isMatchAdmin = await chat.admins.map(user => user.user).indexOf(req.user.id)

        if(isMatchUser !== -1) {
            isMatchUser = 1
        } else {
            return res.status(404).json({ errors: [{msg: 'No such user'}] })
        }

        if(isMatchAdmin !== -1) {
            isMatchAdmin = 1
        } else {
            return res.status(401).json({ errors: [{msg: 'You are not an admin'}] })
        }

        if(isMatchUser === 1 && isMatchAdmin === 1) {
            index = await chat.users.map(user => user.user).indexOf(req.params.user_id)
            chat.users[index].isMember = true
            await chat.save()
        } else {
            return res.status(401).json({ errors: [{msg: 'You are not an admin'}] })
        }

        res.json(chat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/chats/message/:chat_id
// @desc    Send message
// @access  Private
router.put('/message/:chat_id', [
    check('text', 'Text is required')
        .not()
        .isEmpty()
], auth, async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const chat = await Chat.findById(req.params.chat_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let isMatchUser = await chat.users.map(user => user.user).indexOf(req.user.id)

        if(isMatchUser !== -1 && chat.users[isMatchUser].isMember === true) {
            chat.messages.push({ text: req.body.text, user: req.user.id })
        } else {
            return res.status(400).json({ errors: [{msg: 'Not authorized'}] })
        }

        await chat.save()

        res.json(chat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/chats/deletemessage/:chat_id/:message_id
// @desc    Delete message
// @access  Private
router.put('/deletemessage/:chat_id/:message_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let isMatchMessage = await chat.messages.map(message => message.user).indexOf(req.params.message_id)
        let isMatchUser = await chat.users.map(user => user.user).indexOf(req.user.id)
        let isMatchAdmin = await chat.admins.map(user => user.user).indexOf(req.user.id)

        if(isMatchMessage === -1) {
            return res.status(404).json({ msg: 'No such message'})
        }

        if(isMatchUser === -1) {
            return res.status(404).json({ msg: 'Not authorized'})
        }

        if(isMatchAdmin !== -1) {
            isMatchAdmin = 1
        }

        if(chat.users[isMatchUser].user === chat.messages[isMatchMessage].user || isMatchAdmin) {
            chat.messages.splice(isMatchMessage, 1)
        } else {
            return res.status(400).json({ errors: [{msg: 'Not authorized'}] })
        }

        await chat.save()

        res.json(chat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/chats/kickmember/:chat_id/:user_id
// @desc    Kick Member
// @access  Private
router.put('/kickmember/:chat_id/:user_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let isKickedMatchUser = await chat.users.map(user => user.user).indexOf(req.params.user_id)
        let isKickedMatchAdmin = await chat.admins.map(user => user.user).indexOf(req.params.user_id)
        let isMatchAdmin = await chat.admins.map(user => user.user).indexOf(req.user.id)

        if(isKickedMatchUser === -1 || isMatchAdmin === -1) {
            return res.status(400).json({ msg: 'Not authorized or no such user' })
        }
        
        if(isKickedMatchUser !== -1 && isMatchAdmin !== -1) {
            chat.users.splice(isKickedMatchUser, 1)
        }

        if(isKickedMatchAdmin !== -1 && isMatchAdmin !== -1) {
            if(chat.admins.length === 1) {
                return res.status(400).json({ msg: 'You can not kick yourself if you are only admin left' })
            }
            chat.admins.splice(isMatchAdmin, 1)
        }

        await chat.save()

        res.json(chat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   PUT api/chats/leave/:chat_id
// @desc    Leave
// @access  Private
router.put('/leave/:chat_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let isMatchUser = await chat.users.map(user => user.user).indexOf(req.user.id)
        let isMatchAdmin = await chat.admins.map(user => user.user).indexOf(req.user.id)

        if(isMatchUser === -1) {
            return res.status(400).json({ msg: 'Not authorized' })
        }

        if(chat.users.length === 1) {
            return res.status(400).json({ msg: 'You can not left, delete chat' })
        }

        if(isMatchUser !== -1) {
            chat.users.splice(isMatchUser, 1)
        }
        
        if(isMatchAdmin !== -1) {
            chat.admins.splice(isMatchAdmin, 1)
        }

        await chat.save()

        res.json(chat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   Get api/chats/:chat_id
// @desc    Get chat
// @access  Private
router.get('/:chat_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let isMatchUser = await chat.users.map(user => user.user).indexOf(req.user.id)

        if(isMatchUser === -1) {
            return res.status(400).json({ msg: 'Not authorized'})
        }

        res.json(chat)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router