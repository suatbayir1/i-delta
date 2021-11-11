const express = require("express");
const router = express.Router();
const EbsiWallet = require('../services/EbsiWallet');
const DidManager = require('../services/DidManager');
const didController = require('../controllers/didController');
const auth = require("../middlewares/auth");

// get did list
router.get("/", auth.isAuthorized('getAllDids'), didController.getAllDids)

// create did
router.post("/createDid",
    [
        didController.validate('createDid'),
        auth.isAuthorized("createDid")
    ],
    didController.createDid
)

// sign jwt
router.post("/signJwt",
    [
        didController.validate('signJwt'),
        auth.isAuthorized("signJwt")
    ],
    didController.signJwt
)

// verify jwt
router.post("/verify",
    [
        didController.validate("verify"),
        auth.isAuthorized('verify')
    ],
    didController.verify
)

module.exports = router;
