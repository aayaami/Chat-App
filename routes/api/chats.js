const router = require('express').Router()
const mongoose = require('mongoose')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Chat = require('../../models/Chat')



// @route   GET api/chats/find
// @desc    Get chats
// @access  Private
router.get('/find', auth, async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const chats = await Chat.find(searchOptions).select("name").select("users").select("joinRequests").limit(10).exec()
        // const chats = await Chat.find(searchOptions).select("name").select("joinRequests").limit(10).exec()

        if(!chats) {
            return res.status(400).json({ msg: 'No chats' })
        }
        
        const id = req.user.id.replace(/^"(.+(?="$))"$/, '$1')

        let filteredChats = await chats.filter(chat => {
            let userFound = false
            let requestFound = false
            chat.users.forEach(user => {
                if(id == user.user) {
                    userFound = true
                }
            })
            chat.joinRequests.forEach(joinRequests => {
                if(id == joinRequests.user) {
                    requestFound = true;
                }
            })
            if(!userFound && !requestFound) {
                return chat
            }
        })

        res.json(filteredChats)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   GET api/chats/me
// @desc    Get my chats
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const chats = await Chat.find({ users: { $elemMatch: { user: req.user.id } } })

        if(!chats) {
            return res.status(400).json({ msg: 'No chats' })
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
        const user = await User.findById(req.user.id)
        
        const newChat = new Chat({
            name,
            messages: [],
            admins: [],
            users: []
        })

        newChat.admins.push({ user: req.user.id })
        newChat.users.push({ user: req.user.id })

        user.userChats.push({chat: newChat._id})

        await newChat.save()
        await user.save()
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
        
        let isMatch = await chat.joinRequests.map(user => user.user).indexOf(req.user.id)
        
        if(isMatch !== -1) {
            return res.status(400).json({ errors: [{msg: 'Join request already sent'}] })
        } 

        chat.joinRequests.push({ user: req.user.id })

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
        const user = await User.findById(req.params.user_id)

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }

        let joinRequestIndex = await chat.joinRequests.map(user => user.user).indexOf(req.params.user_id)

        if(joinRequestIndex === -1) {
            return res.status(404).json({ errors: [{msg: 'No such user'}] })
        }


        let adminIndex = await chat.admins.map(user => user.user).indexOf(req.user.id)

        if(adminIndex === -1) {
            return res.status(401).json({ errors: [{msg: 'You are not an admin'}] })
        }
        
        chat.users.push({ user: req.params.user_id })
        user.userChats.push({ chat: req.params.chat_id })
        chat.joinRequests.splice(joinRequestIndex, 1)
        
        await chat.save()
        await user.save()

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

        if(isMatchUser !== -1) {
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

// @route   Get api/chats/messages/:chat_id
// @desc    Get chat messages
// @access  Private
router.get('/messages/:chat_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id).select('messages').select('users')
            .populate({ path:'messages.user', select: 'name' })

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

// @route   Get api/chats/:chat_id
// @desc    Get chat
// @access  Private
router.get('/:chat_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chat_id)
            .populate({ path:'messages.user', select: 'name' })
            .populate({ path:'users.user', select: 'name' })
            .populate({ path:'joinRequests.user', select: 'name' })

        if(!chat) {
            return res.status(401).json({ msg: 'Chat does not exist' })
        }
        
        let isMatchUser = await chat.users.map(user => user.user._id).indexOf(req.user.id)

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