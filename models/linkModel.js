const mongoose = require('mongoose');
const linkSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nameLink: String,
    longLink: String,
    shortLink: String,
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('link', linkSchema);