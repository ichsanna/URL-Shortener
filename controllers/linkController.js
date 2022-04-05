const randomString = require('randomstring');
const mongoose = require('mongoose')

const Link = require('../models/linkModel')
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
            let newLink = new Link({
                owner: userId,
                nameLink: nameLink,
                longLink: longLink,
                shortLink: shortLink
            })
            let savedLink = await newLink.save()
            resStatus = 201
            resData = resFormat(true, msg.successCreateLink, savedLink)
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    editLink: async (req, res) => {
        try {
            let { linkId, nameLink, longLink } = req.body.linkId;
            let resStatus, resData
            let editedLink = await Link.findOneAndUpdate({ _id: linkId }, { $set: { nameLink: nameLink, longLink: longLink } })
            resStatus = 200
            resData = resFormat(true, msg.successEditLink, editedLink)
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
            await Link.findByIdAndDelete(linkId)
            resStatus = 200
            resData = resFormat(true, msg.successDeleteLink, '')
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinkById: async (req, res) => {
        try {
            let id = req.params.id
            let resStatus, resData
            let data = await Link.findById(id)
            if (data) {
                resStatus = 200
                resData = resFormat(true, msg.successGetLink, data)
            }
            else {
                resStatus = 404
                resData = resFormat(false, msg.noLinkFoundById, data)
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
            let links = await Link.find({ owner: userId }).exec()
            if (links) {
                resStatus = 200
                resData = resFormat(true, msg.successGetLinks, links)
            }
            else {
                resStatus = 404
                resData = resFormat(false, msg.noLinkFound, data)
            }
            res.status(resStatus).json(resData)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    }
}
module.exports = linkMethods;