from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.middlewares.ApiBase import ApiBase
from app.config import required_keys, request_keys, response_messages, secret
from app.models.BCModel import BCModel
from app.helpers.HelperFunctions import token_control
import datetime

class BCController(FlaskView, ApiBase):
    def __init__(self):
        self.bcModel = BCModel()

    @route("add", methods = ["POST"])
    @token_control(roles = ["admin", "member"])
    def add(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.bc["add"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.bc["add"])

            result = self.bcModel.add(payload)

            if result == 409:
                return ApiBase.response(self, message = response_messages.add_bc["already_exists"]), 409
            elif not result:
                raise Exception("Error")

            return ApiBase.response(self, data = result, message = response_messages.add_bc["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400
