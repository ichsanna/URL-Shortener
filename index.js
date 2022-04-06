const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRouter')
const linkRoutes = require('./routes/linkRouter')
const webRoutes = require('./routes/webRouter')
const resFormat = require('./configs/responseFormat')
const msg = require('./configs/responseMessages')

require('dotenv').config()

const app = express()

app.set('view engine','ejs')

app.set('views', path.join(__dirname, 'public/views/pages'))
app.use(express.static('public/assets'));

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

app.use('/', webRoutes)
app.use('/api/user', userRoutes)
app.use('/api/link', linkRoutes)

app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json(resFormat(false,msg.invalidRoute,null));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000')
});