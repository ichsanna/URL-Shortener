const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()

router.get('/', async (req, res) => {
    let token = req.cookies.token
    let isAuthorized = await auth.verifyTokenWeb(token)
    if (isAuthorized) {
        res.render("index")
    }
    else res.redirect("/login")
})
router.get('/login', async (req, res) => {
    let token = req.cookies.token
    let isAuthorized = await auth.verifyTokenWeb(token)
    if (isAuthorized) {
        res.redirect("/")
    }
    else res.render("login")

})
router.get('/register', async (req, res) => {
    let token = req.cookies.token
    let isAuthorized = await auth.verifyTokenWeb(token)
    if (isAuthorized) {
        res.redirect("/")
    }
    else res.render("register")
})

module.exports = router;