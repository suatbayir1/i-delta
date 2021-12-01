const axios = require('axios');

class EbsiService {
    constructor() {
        this.createUrl = process.env.CREATE_EBSI_DID_URL;
        this.resolveUrl = process.env.RESOLVE_EBSI_DID_URL;
    }

    createDid = async (document) => {
        try {
            const resp = await axios.post(this.createUrl, document)

            return { status: 200, data: resp.data };
        } catch (err) {
            return { status: 400, message: err.response.data }
        }
    }

    resolveDid = async (did) => {
        try {
            let url = `${this.resolveUrl}/${did}`;

            const resp = await axios.get(url);

            return { status: 200, data: resp.data };
        } catch (err) {
            return { status: 400, message: err.response.data }
        }
    }
}

module.exports = EbsiService;