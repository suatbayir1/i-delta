const mongoose = require('mongoose');

const DidSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    addresses: {
        type: Array,
        required: true
    },
    didName: {
        type: String,
        required: true
    },
    passPhrase: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    did: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('dids', DidSchema);