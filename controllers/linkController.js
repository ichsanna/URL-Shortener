const randomString = require('randomstring');
const mongoose = require('mongoose')

const Link = require('../models/linkModel')
const User = require('../models/userModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const linkMethods = {
    addNewLink: async (req, res) => {
        try {
            let userId = mongoose.Types.ObjectId(req.body.userId);
            let { nameLink, longLink } = req.body
            let shortLink = randomString.generate({
                length: 8,
                charset: 'alphanumeric'
            })
            let user = await User.findById(userId)
            if (user) {
                if (nameLink && longLink) {
                    let newLink = new Link({
                        owner: userId,
                        nameLink: nameLink,
                        longLink: longLink,
                        shortLink: shortLink
                    })
                    let savedLink = await newLink.save()
                    resStatus = 201
                    resData = resFormat(true, msg.successCreateLink, savedLink)

                }
                else {
                    resStatus = 422
                    resData = resFormat(false, msg.failedCreateLink, null)
                }
            } else {
                resStatus = 404
                resData = resFormat(false, msg.noUserFoundById, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    editLink: async (req, res) => {
        try {
            let { linkId, nameLink, longLink } = req.body;
            let resStatus, resData
            if (linkId) {
                let editedLink = await Link.findOneAndUpdate({ _id: linkId }, { $set: { nameLink: nameLink, longLink: longLink } })
                if (editedLink) {
                    resStatus = 200
                    resData = resFormat(true, msg.successEditLink, editedLink)
                }
                else {
                    resStatus = 404
                    resData = resFormat(true, msg.noLinkFoundByLinkId, null)
                }
            }
            else {
                resStatus = 422
                resData = resFormat(false, msg.failedEditLink, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    deleteLink: async (req, res) => {
        try {
            let linkId = req.body.linkId
            let resStatus, resData
            if (linkId) {
                let deletedLink = await Link.findByIdAndDelete(linkId)
                if (deletedLink) {
                    resStatus = 200
                    resData = resFormat(true, msg.successDeleteLink, null)
                }
                else {
                    resStatus = 404
                    resData = resFormat(true, msg.noLinkFoundByLinkId, null)
                }
            }
            else {
                resStatus = 422
                resData = resFormat(true, msg.failedDeleteLink, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinkById: async (req, res) => {
        try {
            let linkId = req.params.id
            let resStatus, resData
            if (linkId) {
                let data = await Link.findById(linkId)
                if (data) {
                    resStatus = 200
                    resData = resFormat(true, msg.successGetLink, data)
                }
                else {
                    resStatus = 404
                    resData = resFormat(false, msg.noLinkFoundByLinkId, null)
                }
            }
            else {
                resStatus = 422
                resData = resFormat(false, msg.failedGetLink, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinksByUser: async (req, res) => {
        try {
            let userId = req.params.id
            let resStatus, resData
            if (userId) {
                let links = await Link.find({ owner: userId }).exec()
                if (links) {
                    resStatus = 200
                    resData = resFormat(true, msg.successGetLinks, links)
                }
                else {
                    resStatus = 404
                    resData = resFormat(false, msg.noLinkFoundByUserId, null)
                }
            }
            else {
                resStatus = 422
                resData = resFormat(false, msg.failedGetLinks, null)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    }
}
module.exports = linkMethods;