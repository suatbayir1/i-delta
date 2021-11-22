const { Agent, Scope, Session } = require("@cef-ebsi/app-jwt");

// const { Agent, Session } = require("@cef-ebsi/oauth2-auth");

const { EbsiWallet } = require('@cef-ebsi/wallet-lib');
const { JsonRpcProvider } = require("@ethersproject/providers");
const { BigNumber } = require("@ethersproject/bignumber");

exports.getAcessToken = async (req, res) => {
    try {
        const cliPrivKey = req.body.privateKey;
        // "-----BEGIN PRIVATE KEY-----\nMIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgk/YY7qowLw8vX9sPNpf2\nS4R8krPnpU+VR43/hUZRiAChRANCAARk0QksYVVEvpCQp+UFgbNfOaYTBlQ7bE9V\nVcakNdAq2ACfOWBoOCPNAKikXjwrYyPAscOPW3S/xc7y2VLdipvL\n-----END PRIVATE KEY-----\n";
        const agent = new Agent(Scope.COMPONENT, cliPrivKey, { issuer: "ebsi-wallet" });

        const request = await agent.createRequestPayload("ebsi-ledger");
        console.log(request);
        res.status(200).json(request);
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

exports.newSession = async (req, res) => {
    try {
        const apiPrivKey = "eyJhbGciOiJFUzI1NiIsImtpZCI6IjZkODU4MTAyNDAyZGJiZWIwZjliYjcxMWUzZDEzYTEyMjk2ODQ3OTJkYjQ5NDBkYjBkMGU3MWMwOGNhNjAyZTEifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkVyaWMgRC4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.gmVcj7rcENUDesVOSKRzvcMbxT_3zf2Sz771pdy3E1t4P-aKFxV1Vkcry2gvoQ1k11xvE0RSs3jYa13qsjFAzg";
        const apiName = "ebsi-ledger";
        const tarProvider = "https://api.intebsi.xyz/trusted-apps-registry/v1";
        const didResolver = "https://api.intebsi.xyz/did/v1/identifiers";
        // const session = new Session(apiName, apiPrivKey, tarProvider, didResolver);
        const session = new Session(apiName);



        console.log("session", session);
        console.log(req.body);

        const response = await session.newSession(req.body);

        console.log("response", response.accessToken);

        let token = response.accessToken;

        session.verify(token);

        res.send(response);

    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

exports.oauthAgent = async (req, res, next) => {
    try {
        // The client "ebsi-wallet" creates a request to access the "ebsi-ledger"
        const cliPrivKey =
            "64e4a7a1e2e463e95e2e3413deb7676221544e92b951705142fd9c719ea4af3e";
        // The client "ebsi-wallet" provides its TAR kid
        const kid =
            "https://api.test.intebsi.xyz/trusted-apps-registry/v2/apps/0xe562ff1197ca55d95e531c0caa1b803e5bebdf328de3b000eb04e12a94adc0f1";
        const agent = new Agent(cliPrivKey, { issuer: "ebsi-wallet", kid });
        // The client "ebsi-wallet" uses its agent to create a Request
        const request = await agent.createRequestPayload("ebsi-ledger", {
            nonce: "123",
        }); // Optional: defining nonce or defining any more fields in the payload of the request
        console.log(request);

        const apiPrivKey =
            "9d678b6edef394cd0182cbc76be7fd69021c2d90c8739837737afea3723314e2";

        // Optional: set none, one, some or all
        const apiName = "authorisation-api"; // Name of the service using Session instance
        const tarProvider = "https://api.test.intebsi.xyz/trusted-apps-registry/v2"; // Define custom TAR provider endpoint
        const didResolver = "https://api.test.intebsi.xyz/did-registry/v2/identifiers"; // Define a custom resolver for DIDs
        const expiration = {
            requestToken: 10,
            accessToken: 800,
        }; // Set a different expiration time for the request token and access token (by default 15 and 900 respectively):
        const kid2 =
            "https://api.test.intebsi.xyz/trusted-apps-registry/v2/apps/0xe562ff1197ca55d95e531c0caa1b803e5bebdf328de3b000eb04e12a94adc0f1"; // custom kid that resolves the publickey

        const session = new Session(apiPrivKey, {
            appName: apiName,
            tarProvider,
            didResolver,
            expiration,
            kid: kid2,
        });

        console.log("session", session);

        const pubKey = await session.verifyAuthenticationRequest(
            request.clientAssertion,
            {
                tarProvider,
            }
        );

        console.log("pubkey", pubKey)

        res.status(200).json(request);
    } catch (err) {
        res.status(403).json({ message: err.message })
    }
}
