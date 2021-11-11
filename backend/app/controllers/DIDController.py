from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.middlewares.ApiBase import ApiBase
from app.config import required_keys, request_keys, response_messages, secret
from app.models.DIDModel import DIDModel
from app.helpers.HelperFunctions import token_control
from app.services.EbsiWallet import EbsiWallet
import datetime
import base64
from Crypto import Random
from Crypto.PublicKey import RSA

class DIDController(FlaskView, ApiBase):
    def __init__(self):
        self.didModel = DIDModel()

    def generateKeyPair(self, keyOptions):
        try:
            KeyOptions = {
                "keyFormat": ["hex", "jwk", "pem"],
                "asymmetricKeyType": ["ec", "rsa", "ed25519", "x25519"],
                "keyCurve": ["secp256k1", "secp256r1", "ed25519"]
            }

            print("keyOptions", keyOptions)

            # generate public/private key pair
            private_key = RSA.generate(1024, Random.new().read)
            public_key = private_key.publickey()

            return {
                "keyOptions": {
                    "format": "pem",
                    "keyType": "rsa",
                    "keyCurve": "secp256k1"
                },
                "privateKey": private_key.exportKey().decode(),
                "publicKey": public_key.exportKey().decode()
            }
        except:
            return False


    @route("generate", methods = ["POST"])
    @token_control(roles = ["admin", "member"])
    def generate(self, user):
        try:
            print("user", user)
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.did["generate"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.did["generate"])
            payload["userID"] = user["userID"]

            keyOptions = {
                "keyFormat": "pem",
                "asymmetricKeyType": "rsa",
                "keyCurve": "secp256k1"
            }

            keyPair = self.generateKeyPair(keyOptions)

            if not keyPair:
                raise Exception("An error occurred while generating a key pair")

            ebsiWallet = EbsiWallet(keyPair["privateKey"])

            did = ebsiWallet.createDid()

            if not did:
                raise Exception("An error occurred while creating a did")

            payload.update(keyPair)
            payload.update({"did": did})

            result = self.didModel.generate(payload)

            if result == 409:
                return ApiBase.response(self, message = response_messages.did_generate["already_exists"]), 409
            elif not result:
                raise Exception("Error")

            return ApiBase.response(self, data = keyPair, message = response_messages.did_generate["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400
