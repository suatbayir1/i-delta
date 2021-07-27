from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.middlewares.ApiBase import ApiBase
from app.config import required_keys, request_keys, response_messages, secret
from app.models.AuthModel import AuthModel
from datetime import datetime
from werkzeug.security import check_password_hash
import jwt
import datetime
import time

class AuthController(FlaskView, ApiBase):
    def __init__(self):
        self.authModel = AuthModel()

    @route("signIn", methods = ["POST"])
    def signIn(self):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.auth["signIn"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.auth["signIn"])

            user_data = self.authModel.is_user_exists(payload["username"])

            if not user_data:
                return ApiBase.response(self, message = response_messages.signIn["not_found"]), 404

            if check_password_hash(user_data[0]["password"], payload["password"]):
                print(user_data)

                token = jwt.encode({
                    "username": user_data[0]["username"],
                    "userID": user_data[0]["_id"]["$oid"],
                    "role": user_data[0]["role"],
                    "expiry_time": time.mktime((datetime.datetime.now() + datetime.timedelta(days=1)).timetuple())
                }, secret.authentication["SECRET_KEY"])

                del user_data[0]['password']

                data = {
                    'token': token.decode("UTF-8"), 
                    'user': user_data[0]
                }

                return ApiBase.response(self, data = data, message = response_messages.signIn["success"])

            return ApiBase.response(self, message = response_messages.signIn["wrong_password"]), 403
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400


    @route("signUp", methods = ["POST"])
    def signUp(self):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.auth["signUp"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.auth["signUp"])
            payload["createdAt"] = datetime.datetime.now()

            result = self.authModel.add_user(payload)

            if not result:
                return ApiBase.response(self, message = response_messages.signUp["already_exists"]), 409
            
            return ApiBase.response(self, message = response_messages.signUp["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400
