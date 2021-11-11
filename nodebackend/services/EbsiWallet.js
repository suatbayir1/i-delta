const crypto = require("crypto");
const { SignJWT, importPKCS8 } = require("jose");

class EbsiWallet {
    constructor(privateKey) {
        this.privateKey = privateKey;
    }

    createDid = async () => {
        const randomString = crypto.randomBytes(32).toString('hex');
        return `did:ebsi:${randomString}`;
    }

    signJwt = async (payload) => {
        try {
            const algorithm = 'ES256'
            const ecPrivateKey = await importPKCS8(this.privateKey, algorithm)

            const jwt = await new SignJWT(payload)
                .setProtectedHeader({ alg: 'ES256' })
                .setIssuedAt()
                .setIssuer('urn:example:issuer')
                .setAudience('urn:example:audience')
                .setExpirationTime('2h')
                .sign(ecPrivateKey)

            return jwt;
        } catch (err) {
            return err;
        }
    }
}

module.exports = EbsiWallet;