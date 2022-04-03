const randomString = require('randomstring');
const mongoose = require('mongoose')

const Link = require('../models/linkModel')
const msg = require('../configs/responseMessages')
const resFormat = require('../configs/responseFormat')

const linkMethods = {
    addNewLink: async (req, res) => {
        try {
            let userId = mongoose.Types.ObjectId(req.body.userId);
            let nameLink = req.body.nameLink
            let longLink = req.body.longLink
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
            await newLink.save()
            res.status(201).json(resFormat(true, msg.successCreateLink, ''))
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    editLink: async (req, res) => {
        try {
            let linkId = req.body.linkId;
            let nameLink = req.body.nameLink
            let longLink = req.body.longLink
            await Link.findOneAndUpdate({_id: linkId},{$set:{nameLink: nameLink,longLink: longLink}})
            res.status(201).json(resFormat(true, msg.successEditLink, ''))
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    deleteLink: async (req,res) =>{
        try{
            let linkId = req.body.linkId
            await Link.findByIdAndDelete(linkId)
            res.status(201).json(resFormat(true, msg.successDeleteLink, ''))
        }
        catch(err){
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinkById: async (req, res) => {
        try {
            let id = req.params.id
            let data = await Link.findById(id)
            if (data) {
                res.status(200).json(resFormat(true, msg.successGetLink, data))
            }
            else {
                res.status(404).json(resFormat(false, msg.noLinkFoundById, data))
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    },
    getLinksByUser: async (req, res) => {
        try {
            let userId = req.params.id
            let links = await Link.find({ owner: userId }).exec()
            if (links) {
                res.status(200).json(resFormat(true, msg.successGetLinks, links))
            }
            else {
                res.status(404).json(resFormat(false, msg.noLinkFound, data))
            }
        }
        catch (err) {
            res.status(400).json(resFormat(false, null, err))
        }
    }
}
module.exports = linkMethods;