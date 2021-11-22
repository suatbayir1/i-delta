const axios = require('axios');

class EbsiService {
    constructor() {
        this.createUrl = process.env.CREATE_EBSI_DID_URL;
    }

    createDid = async (document) => {
        try {
            const resp = await axios.post(this.createUrl, document)
            console.log("resp", resp.data);

            return { status: 200, data: resp.data };
        } catch (err) {
            // console.log("err", err);
            return { status: 400, message: err.response.data }
        }
    }
}

module.exports = EbsiService;