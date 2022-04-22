const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const linkController = require('../controllers/linkController')

router.get('/', async (req, res) => {
    let token = req.cookies.token
    let verify = await auth.verifyTokenWeb(token)
    if (verify) {
        res.render("index", { isAuthorized: verify.isAuthorized, username: verify.username })
    }
    else res.redirect("/login")
})
router.get('/login', async (req, res) => {
    let token = req.cookies.token
    let verify = await auth.verifyTokenWeb(token)
    if (verify) {
        res.redirect("/")
    }
    else res.render("login", { isAuthorized: verify.isAuthorized})

})
router.get('/register', async (req, res) => {
    let token = req.cookies.token
    let verify = await auth.verifyTokenWeb(token)
    if (verify) {
        res.redirect("/")
    }
    else res.render("register", { isAuthorized: verify.isAuthorized})
})
router.get('/:shortLink', linkController.redirectToLink)
module.exports = router;