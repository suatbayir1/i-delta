const express = require("express");
const router = express.Router();
const ebsiController = require('../controllers/ebsiController');

const { importJWK, exportJWK, exportPKCS8, calculateJwkThumbprint } = require("jose");

// Get access token
router.get("/", ebsiController.getAcessToken);

// Sessions
router.post("/sessions", ebsiController.newSession)

// agent
router.get("/oauth-agent", ebsiController.oauthAgent)

router.get("/importJwk", async (req, res) => {
    const ecPublicKey = await importJWK({
        "kty": "EC",
        "crv": "secp256k1",
        "x": "Bkv6_n-pkWhS20Ht_QJ0uMKxERPEvNFWq7jPHpmZDH4",
        "y": "pwwd81UYGS2dY7k-9XbffZaGBHCQxNUiMJ7L0C6dOCM",
        "d": "zA8-9eRBYfVKvkaq38gMZZ0wBb9V_CgCylHSczKWwGQ",
        "kid": "did:ebsi:zZ9UzwVZfHJbiMZ7du8jzrE#keys-1"
    }, 'ES256')

    console.log(ecPublicKey)

    const privateJwk1 = await exportPKCS8(ecPublicKey);

    console.log(privateJwk1);

    const privateJwk = await exportJWK(ecPublicKey);

    console.log(privateJwk)

    const thumbprint = await calculateJwkThumbprint({
        "kty": "EC",
        "crv": "secp256k1",
        "x": "EI7hWxeK_X8XWQcP2mfT-ZyMep9LkrZndjX6-oKoI0s",
        "y": "Xi5-10Qzzwb_H7Qy6IzZoUkqLSxqdZVW6K0WmmQIbNU",
        "d": "DhF5ZdMy3nGPiRxZZZ53IcQ27O8UBtewEoHHBvxIEnk",
        "kid": "did:ebsi:zn9DHmTte2x25BuJ16HTdze#keys-1"
    })

    console.log(thumbprint)
})

module.exports = router;