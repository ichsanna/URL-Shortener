require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const resFormat = require('../configs/responseFormat')
const msg = require('../configs/responseMessages')

const auth = {
    verifyToken: async (req,res,next)=>{
        try {
            const token = req.headers.authorization.split(' ')[1]
            let decoded =  auth.decodeToken(token)
            let username = decoded.username
            let user = await User.findOne({username: username})
            if (user) next()
        } catch (err) {
            return res.status(401).json(resFormat(false,msg.failedAuth,err))
        }
    },
    decodeToken: (token)=>{
        return jwt.verify(token, process.env.JWT_SECRET)
    },
    verifyTokenWeb: async (token)=>{
        try {
            if (!token) return false
            let decoded =  auth.decodeToken(token)
            let username = decoded.username
            let user = await User.findOne({username: username})
            if (user) return true
            else return false
        } catch (err) {
            return false
        }
    },
}
module.exports = auth