const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const userMethods = {
    getUserById: async (req, res) => {
        try {
            let userId = req.params.id
            let resStatus, resData
            if (userId) {
                let data = await User.findById(userId).select('username created')
                if (data) {
                    resStatus = 200
                    resData = resFormat(true, msg.successGetUser, data)
                }
                else {
                    resStatus = 404
                    resData = resFormat(false, msg.noUser, null)
                }
            }
            else {
                resStatus = 422
                resData = resFormat(false, msg.failedGetUser, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let users = await User.find().select('username created').exec()
            let resStatus, resData
            if (users) {
                resStatus = 200
                resData = resFormat(true, msg.successGetUsers, users)
            }
            else {
                resStatus = 404
                resData = resFormat(false, msg.noUser, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userLogin: async (req, res) => {
        try {
            let { username, password } = req.body
            let resStatus, resData
            if (username && password) {
                let getUser = await User.findOne({ username: username })
                if (getUser) {
                    let comparePassword = await bcrypt.compare(password, getUser.password)
                    let token = signToken(username)
                    if (comparePassword) {
                        resStatus = 200
                        resData = resFormat(true, msg.successLogin, { token: token, id: getUser._id })
                    }
                    else {
                        resStatus = 401
                        resData = resFormat(false, msg.incorrectUsernamePassword, null)
                    }
                }
                else {
                    resStatus = 401
                    resData = resFormat(false, msg.incorrectUsernamePassword, null)
                }
            }
            else {
                resStatus = 422
                resData = resFormat(false, msg.failedLogin, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    userRegister: async (req, res) => {
        try {
            let { username, password } = req.body
            let resStatus, resData
            if (username && password) {
                let getUser = await User.findOne({ username: username }).select('username created')
                if (getUser) {
                    resStatus = 409
                    resData = resFormat(false, msg.duplicateUsername, getUser)
                }
                else {
                    let encryptedPassword = await bcrypt.hash(password, 10)
                    let newUser = new User({
                        username: username,
                        password: encryptedPassword
                    })

                    let createdUser = await newUser.save()
                    let token = signToken(username)
                    resStatus = 201
                    resData = resFormat(true, msg.successLogin, { token: token, id: createdUser._id })
                }
            }
            else {
                resStatus = 422
                resData = resFormat(false, msg.failedRegister, null)
            }
            res.status(resStatus).json(resData)
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