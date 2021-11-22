const { generateKeyPairSync } = require('crypto');
const { exportPKCS8, exportSPKI, importPKCS8 } = require('jose');

class DidManager {
    generateKeys = async (passPhrase) => {
        try {
            const { publicKey, privateKey } = generateKeyPairSync('ec', {
                namedCurve: 'secp256k1',
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                }
            });

            return { publicKey, privateKey };
        } catch (err) {
            return false;
        }

    }
}

module.exports = DidManager;
