from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.middlewares.ApiBase import ApiBase
from app.config import required_keys, request_keys, response_messages, secret
from app.models.ActionModel import ActionModel
from app.helpers.HelperFunctions import token_control
import datetime

class ActionController(FlaskView, ApiBase):
    def __init__(self):
        self.actionModel = ActionModel()

    @route("add", methods = ["POST"])
    @token_control(roles = ["admin", "member"])
    def add(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.action["add"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.action["add"])
            payload["createdAt"] = payload["updatedAt"] = datetime.datetime.now()

            result = self.actionModel.add(payload)

            if result == 409:
                return ApiBase.response(self, message = response_messages.add_action["already_exists"]), 409
            elif not result:
                raise Exception('Error')
            
            return ApiBase.response(self, message = response_messages.add_action["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400