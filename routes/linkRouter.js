const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const linkController = require('../controllers/linkController')

router.post('/add', auth.verifyToken, linkController.addNewLink)
router.post('/edit', auth.verifyToken, linkController.editLink)
router.post('/delete', auth.verifyToken, linkController.deleteLink)
router.get('/get/link/:linkId', auth.verifyToken, linkController.getLinkById)
router.get('/get/user/:userId', auth.verifyToken, linkController.getLinksByUser)

module.exports = router;