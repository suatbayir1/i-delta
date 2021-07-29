from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.middlewares.ApiBase import ApiBase
from app.config import required_keys, request_keys, response_messages, secret
from app.models.TransactionModel import TransactionModel
from app.helpers.HelperFunctions import token_control
import datetime

class TransactionController(FlaskView, ApiBase):
    def __init__(self):
        self.transactionModel = TransactionModel()

    @route("add", methods = ["POST"])
    @token_control(roles = ["admin", "member"])
    def add(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.transaction["add"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.transaction["add"])
            payload["createdAt"] = datetime.datetime.now()

            result = self.transactionModel.add(payload)

            if not result:
                raise Exception('Error')
            
            return ApiBase.response(self, message = response_messages.add_transaction["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400
