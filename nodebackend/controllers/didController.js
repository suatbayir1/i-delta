const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');
const DidManager = require('../services/DidManager');
const EbsiWallet = require('../services/EbsiWallet');
const helper = require('../helpers/helper');
const Did = require('../models/Did');
const { jwtVerify, importSPKI } = require('jose');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const EbsiService = require('../services/EbsiService');

const validate = (method) => {
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
        case 'createEbsiDid': {
            return [
                body('name', "name doesn't exists").exists(),
                body('email', "email doesn't exists").exists(),
                body('email', 'Invalid email').isEmail(),
                body('didName', "didName doesn't exists").exists(),
                body('passPhrase', "passPhrase doesn't exists").exists(),
                body('didDocument', "didDocument doesn't exists").exists(),
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

const getAllDids = async (req, res) => {
    try {
        const dids = await Did.find({ "userID": res.locals.user._id })
        res.json({ dids });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

const createDid = async (req, res, next) => {
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

const signJwt = async (req, res) => {
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

const verify = async (req, res) => {
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

const createEbsiDid = asyncErrorWrapper(async (req, res, next) => {
    const { didDocument } = req.body;

    const ebsiService = new EbsiService();

    const result = await ebsiService.createDid(didDocument);

    if (result.status === 400) {
        return next(new CustomError(result.message, result.status));
    }

    res.status(200).json({ data: { "keys": "private key will be here" }, message: "Did created successfully" });

    // return next(new CustomError("new error", 403));
})

module.exports = {
    validate,
    getAllDids,
    createDid,
    signJwt,
    verify,
    createEbsiDid
}