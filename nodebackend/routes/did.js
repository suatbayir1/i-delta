const express = require("express");
const router = express.Router();
const EbsiWallet = require('../services/EbsiWallet');
const DidManager = require('../services/DidManager');
const { validate, createDid, signJwt, verify, createEbsiDid, getAllDids } = require('../controllers/didController');
const auth = require("../middlewares/auth");

// get did list
router.get("/", auth.isAuthorized('getAllDids'), getAllDids)

// ebsi
router.post("/createEbsiDid",
    [
        validate('createEbsiDid'),
        auth.isAuthorized("createEbsiDid")
    ],
    createEbsiDid
)

// create did
router.post("/createDid",
    [
        validate('createDid'),
        auth.isAuthorized("createDid")
    ],
    createDid
)

// sign jwt
router.post("/signJwt",
    [
        validate('signJwt'),
        auth.isAuthorized("signJwt")
    ],
    signJwt
)

// verify jwt
router.post("/verify",
    [
        validate("verify"),
        auth.isAuthorized('verify')
    ],
    verify
)

module.exports = router;
