const mongoose = require('mongoose');

const DidSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        // unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email"
        ]
    },
    location: {
        type: String,
    },
    addresses: {
        type: Array,
        required: [true, "Please provide a addresses"]
    },
    didName: {
        type: String,
        required: [true, "Please provide a didName"]
    },
    passPhrase: {
        type: String,
        required: [true, "Please provide a passPhrase"]
    },
    userID: {
        type: String,
        required: [true, "Please provide a userID"]
    },
    did: {
        type: String,
        required: [true, "Please provide a did"]
    }
})

module.exports = mongoose.model('dids', DidSchema);