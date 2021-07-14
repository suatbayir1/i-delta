import sys
sys.path.insert(1, '/home/suat/Desktop/i-delta/backend/')
from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.controllers.AuthController import AuthController
from app.middlewares.ApiBase import ApiBase
from app.helpers.HelperFunctions import token_control
from flask_cors import CORS

class Api(FlaskView, ApiBase):
    def __init__(self):
        pass

    def index(self):
        return ApiBase.response(self, data = ["one", "two"], message = "response msg", success = True)

    @route("test", methods = ["POST"])
    @token_control(roles = ["admin", "user"])
    def test(self):
        return ApiBase.response(self, data = ["one", "two"], message = "response msg", success = True)


if __name__ == "__main__":
    app = Flask(__name__)
    CORS(app,supports_credentials=True)
    Api.register(app, route_base = '/api/')
    AuthController.register(app, route_base = '/api/auth/')
    app.run(debug = True, port = 9632)