const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator').default

const User = require('../models/userModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const userMethods = {
    getUserById: async (req, res) => {
        try {
            let data = async () => {
                let userId = req.params.userId
                if (!validator.isMongoId(userId)) {
                    return { status: 422, data: resFormat(false, msg.failedGetUser, null) }
                }
                let users = await User.findById(userId).select('username created')
                if (!users) {
                    return { status: 404, data: resFormat(false, msg.noUser, null) }
                }
                return { status: 200, data: resFormat(true, msg.successGetUser, data) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let data = async () => {
                let users = await User.find().select('username created').exec()
                if (users.length === 0) {
                    return { status: 404, data: resFormat(false, msg.noUser, null) }
                }
                return { status: 200, data: resFormat(true, msg.successGetUsers, users) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userLogin: async (req, res) => {
        try {
            let data = async () => {
                let { username, password } = req.body
                if (!username || !password) {
                    return { status: 422, data: resFormat(false, msg.failedLogin, null) }
                }
                let getUser = await User.findOne({ username: username })
                if (!getUser) {
                    return { status: 401, data: resFormat(false, msg.incorrectUsernamePassword, null) }
                }

                let comparePassword = await bcrypt.compare(password, getUser.password)
                let token = signToken(username)
                if (!comparePassword) {
                    return { status: 401, data: resFormat(false, msg.incorrectUsernamePassword, null) }
                }
                return { status: 200, data: resFormat(true, msg.successLogin, { token: token, userId: getUser._id }) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userRegister: async (req, res) => {
        try {
            let data = async () => {
                let { username, password } = req.body
                if (!username || !password) {
                    return { status: 422, data: resFormat(false, msg.failedRegister, null) }
                }
                let getUser = await User.findOne({ username: username }).select('username created')
                if (getUser) {
                    return { status: 409, data: resFormat(false, msg.duplicateUsername, getUser) }
                }
                let encryptedPassword = await bcrypt.hash(password, 10)
                let newUser = new User({
                    username: username,
                    password: encryptedPassword
                })

                let createdUser = await newUser.save()
                let token = signToken(username)
                return { status: 201, data: resFormat(true, msg.successLogin, { token: token, userId: createdUser._id }) } 
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
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