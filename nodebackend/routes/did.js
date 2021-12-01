const express = require("express");
const router = express.Router();
const EbsiWallet = require('../services/EbsiWallet');
const DidManager = require('../services/DidManager');
const {
    validate,
    createDid,
    signJwt,
    verify,
    createEbsiDid,
    resolveEbsiDid,
    getAllDids,
    getSingleDid,
    deleteEbsiDid,
} = require('../controllers/didController');
const { isAuthorized } = require("../middlewares/auth");
const { checkUserExist, checkUserHasDid, checkUserExistWithParam } = require('../middlewares/database/databaseErrorHelpers')

// get did list
router.get("/",
    isAuthorized("getAllDids"),
    getAllDids
)

// ebsi
router.post("/createEbsiDid",
    [
        validate('createEbsiDid'),
        isAuthorized('createEbsiDid'),
        checkUserExist,
        checkUserHasDid,
    ],
    createEbsiDid
)

router.get("/resolveEbsiDid/:did",
    [
        isAuthorized('resolveEbsiDid'),
        checkUserExist,
    ],
    resolveEbsiDid,
)

router.get("/getSingleDid/:userID",
    [
        isAuthorized('getSingleDid'),
        checkUserExistWithParam,
    ],
    getSingleDid
)

router.delete('/deleteEbsiDid/:did',
    [
        isAuthorized('deleteDid'),
    ],
    deleteEbsiDid,
)

// create did
router.post("/createDid",
    [
        validate('createDid'),
        isAuthorized('createDid')
    ],
    createDid
)

// sign jwt
router.post("/signJwt",
    [
        validate('signJwt'),
        isAuthorized('signJwt')
    ],
    signJwt
)

// verify jwt
router.post("/verify",
    [
        validate("verify"),
        isAuthorized('verify')
    ],
    verify
)

module.exports = router;
