const randomString = require('randomstring');
const mongoose = require('mongoose')
const validator = require('validator').default
const qr = require('qrcode')
const stream = require('stream')

const Link = require('../models/linkModel')
const User = require('../models/userModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat');

const linkMethods = {
    addNewLink: async (req, res) => {
        try {
            let data = async () => {
                let { userId, nameLink, longLink } = req.body
                if (!userId || !nameLink || !longLink || !validator.isMongoId(userId) || !validator.isURL(longLink)) {
                    return { status: 422, data: resFormat(false, msg.failedCreateLink, null) }
                }
                userId = mongoose.Types.ObjectId(userId);
                let shortLink
                while (true) {
                    shortLink = randomString.generate({
                        length: 8,
                        charset: 'alphanumeric'
                    })
                    let links = await Link.findOne({ shortLink: shortLink })
                    if (!links) break
                }
                let user = await User.findById(userId)
                if (!user) {
                    return { status: 404, data: resFormat(false, msg.noUserFoundById, null) }
                }
                let newLink = new Link({
                    owner: userId,
                    nameLink: nameLink,
                    longLink: longLink,
                    shortLink: shortLink
                })
                let savedLink = await newLink.save()
                return { status: 201, data: resFormat(true, msg.successCreateLink, savedLink) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    editLink: async (req, res) => {
        try {
            let data = async () => {
                let { linkId, nameLink, longLink } = req.body;
                if (!linkId || !nameLink || !longLink || !validator.isMongoId(linkId) || !validator.isURL(longLink)) {
                    return { status: 422, data: resFormat(false, msg.failedEditLink, null) }
                }
                let editedLink = await Link.findOneAndUpdate({ _id: linkId }, { $set: { nameLink: nameLink, longLink: longLink } })
                if (!editedLink) {
                    return { status: 404, data: resFormat(true, msg.noLinkFoundByLinkId, null) }
                }
                return { status: 200, data: resFormat(true, msg.successEditLink, editedLink) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    deleteLink: async (req, res) => {
        try {
            let data = async () => {
                let linkId = req.body.linkId
                if (!linkId || !validator.isMongoId(linkId)) {
                    return { status: 422, data: resFormat(true, msg.failedDeleteLink, null) }
                }
                let deletedLink = await Link.findByIdAndDelete(linkId)
                if (!deletedLink) {
                    return { status: 404, data: resFormat(true, msg.noLinkFoundByLinkId, null) }
                }
                return { status: 200, data: resFormat(true, msg.successDeleteLink, null) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinkById: async (req, res) => {
        try {
            let data = async () => {
                let linkId = req.params.linkId
                if (!linkId || !validator.isMongoId(linkId)) {
                    return { status: 422, data: resFormat(false, msg.failedGetLink, null) }
                }
                let links = await Link.findById(linkId)
                if (!links) {
                    return { status: 404, data: resFormat(false, msg.noLinkFoundByLinkId, null) }

                }
                return { status: 200, data: resFormat(true, msg.successGetLink, links) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinksByUser: async (req, res) => {
        try {
            let data = async () => {
                let userId = req.params.userId
                if (!userId || !validator.isMongoId(userId)) {
                    return { status: 422, data: resFormat(false, msg.failedGetLinks, null) }
                }
                let links = await Link.find({ owner: userId }).exec()
                if (links.length === 0) {
                    return { status: 404, data: resFormat(false, msg.noLinkFoundByUserId, null) }
                }
                return { status: 200, data: resFormat(true, msg.successGetLinks, links) }
            }
            let resp = await data()
            res.status(resp.status).json(resp.data)
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    redirectToLink: async (req, res) => {
        try {
            let data = async () => {
                let shortLink = req.params.shortLink
                if (!shortLink) {
                    return '/'
                }
                let links = await Link.findOne({ shortLink: shortLink }).select('longLink')
                if (!links) {
                    return '/'
                }
                return links.longLink
            }
            let resp = await data()
            if (validator.isURL((new URL(`https://${resp}`).href))) {
                res.redirect(`https://${resp}`)
            }
            else {
                res.redirect(resp)
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinkQRCode: async (req, res) => {
        try {
            const qrStream = new stream.PassThrough();
            await qr.toFileStream(qrStream, req.params.shortLink,
                {
                    margin: 1,
                    type: 'png',
                    width: 720,
                    errorCorrectionLevel: 'H'
                });
            qrStream.pipe(res);
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    }
}
module.exports = linkMethods;