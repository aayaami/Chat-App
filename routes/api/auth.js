const router = require('express').Router()
const mongoose = require('mongoose')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

// @route   GET api/users
// @desc    Get user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate({ path:'userChats.chat', select: 'name' })
        res.json(user)
    } catch (err) {
        res.status(500).json({ msg: 'Server error' })
    }
})

// @route   POST api/users
// @desc    Login
// @access  Public
router.post('/', [
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Password is required')
        .exists()
],  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if(!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600000 },
            (err, token) => {
            if(err) throw err
            res.json({token})
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router