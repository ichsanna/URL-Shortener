const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);