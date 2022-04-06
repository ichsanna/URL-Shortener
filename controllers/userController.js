require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const userMethods = {
    getUserById: async (req, res) => {
        try {
            let id = req.params.id
            let data = await User.findById(id).select('username created')
            if (data) {
                res.status(200).json(resFormat(true, msg.successGetUser, data))
            }
            else {
                res.status(404).json(resFormat(false, msg.noUser, data))
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let users = await User.find().select('username created').exec()
            if (users) {
                res.status(200).json(resFormat(true, msg.successGetUsers, users))
            }
            else {
                res.status(404).json(resFormat(false, msg.noUser, data))
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userLogin: async (req, res) => {
        try {
            let username = req.body.username
            let password = req.body.password
            let getUser = await User.findOne({ username: username })
            if (getUser) {
                let comparePassword = await bcrypt.compare(password, getUser.password)
                let token = signToken(username)
                if (comparePassword) {
                    res.status(200).json(resFormat(true, msg.successLogin, { token: token, id: getUser._id }))
                }
                else {
                    res.status(401).json(resFormat(false, msg.incorrectUsernamePassword, null))
                }
            }
            else {
                res.status(404).json(resFormat(false, msg.incorrectUsernamePassword, null))
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userRegister: async (req, res) => {
        try {
            let username = req.body.username
            let password = req.body.password
            let getUser = await User.findOne({ username: username }).select('username created')
            if (getUser) {
                res.status(409).json(resFormat(false, msg.duplicateUsername, getUser))
            }
            else {
                let encryptedPassword = await bcrypt.hash(password, 10)
                let newUser = new User({
                    username: username,
                    password: encryptedPassword
                })

                let createdUser = await newUser.save()
                let token = signToken(username)
                res.status(201).json(resFormat(true, msg.successLogin, { token: token, id: createdUser._id }))
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    }
}
function signToken(username) {
    return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '2h' })
}
module.exports = userMethods;