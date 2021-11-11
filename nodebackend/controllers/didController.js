const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');
const DidManager = require('../services/DidManager');
const EbsiWallet = require('../services/EbsiWallet');
const helper = require('../helpers/helper');
const Did = require('../models/Did');
const { jwtVerify, importSPKI } = require('jose')


exports.validate = (method) => {
    switch (method) {
        case 'createDid': {
            return [
                body('name', "name doesn't exists").exists(),
                body('email', "email doesn't exists").exists(),
                body('email', 'Invalid email').isEmail(),
                body('didName', "didName doesn't exists").exists(),
                body('passPhrase', "passPhrase doesn't exists").exists(),
                body('addresses').isArray(),
            ]
        }
        case 'signJwt': {
            return [
                body('credential', "credential doesn't exists").exists(),
                body('privateKey', "privateKey doesn't exists").exists()
            ]
        }
        case 'verify': {
            return [
                body('encryptedJwt', "encryptedJwt doesn't exists").exists(),
                body('publicKey', "publicKey doesn't exists").exists()
            ]
        }
    }
}

exports.getAllDids = async (req, res) => {
    try {
        const dids = await Did.find({ "userID": res.locals.user._id })
        res.json({ dids });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

exports.createDid = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
                message: helper.errorsToString(errors.array())
            })
        }

        // check didName is exists ?
        const isExists = await Did.countDocuments({ didName: req.body.didName, userID: res.locals.user._id });
        if (isExists > 0) {
            return res.status(409).json({
                message: "This didName already exists"
            })
        }

        // Generating key pairs
        const didManager = new DidManager();
        const keys = await didManager.generateKeys(req.body.passPhrase);

        if (!keys || Object.keys(keys).length < 2) {
            throw new Error("An error occurred while creating key pairs")
        }

        // Generating did
        const ebsiWallet = new EbsiWallet(keys.privateKey);
        const did = await ebsiWallet.createDid();

        // Insert record to mongodb
        const record = new Did({
            name: req.body.name,
            email: req.body.email,
            location: req.body.location ? req.body.location : "",
            addresses: req.body.addresses,
            didName: req.body.didName,
            passPhrase: req.body.passPhrase,
            userID: res.locals.user._id,
            did,
            publicKey: keys.publicKey
        })

        await record.save();

        res.status(200)
            .json({
                data: {
                    did,
                    ...keys,
                },
                message: "Did created successfully"
            });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

exports.signJwt = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
                message: helper.errorsToString(errors.array())
            })
        }

        const ebsiWallet = new EbsiWallet(req.body.privateKey);
        const jwt = await ebsiWallet.signJwt(req.body.credential);

        if (typeof jwt != "string") {
            throw new Error(jwt);
        }

        res.json({ jwt });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

exports.verify = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
                message: helper.errorsToString(errors.array())
            })
        }

        const algorithm = 'ES256'
        const ecPublicKey = await importSPKI(req.body.publicKey, algorithm)

        const { payload, protectedHeader } = await jwtVerify(req.body.encryptedJwt, ecPublicKey, {
            issuer: 'urn:example:issuer',
            audience: 'urn:example:audience'
        })

        res.status(200).json({ decryptedJwt: payload });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}