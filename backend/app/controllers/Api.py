import sys
sys.path.insert(1, '/home/suat/Desktop/i-delta/backend/')
from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.middlewares.ApiBase import ApiBase
from app.helpers.HelperFunctions import token_control
from flask_cors import CORS

from app.controllers.AuthController import AuthController
from app.controllers.ProjectController import ProjectController 
from app.controllers.ActionController import ActionController
from app.controllers.TransactionController import TransactionController
from app.controllers.BCController import BCController
from app.controllers.SCController import SCController

class Api(FlaskView, ApiBase):
    def __init__(self):
        pass

    def index(self):
        return ApiBase.response(self, data = ["one", "two"], message = "response msg", success = True)

    @route("test", methods = ["POST"])
    @token_control(roles = ["admin", "user"])
    def test(self, user):
        return ApiBase.response(self, data = ["one", "two"], message = "response msg", success = True)


if __name__ == "__main__":
    app = Flask(__name__)
    CORS(app,supports_credentials=True)
    Api.register(app, route_base = '/api/')
    AuthController.register(app, route_base = '/api/auth/')
    ProjectController.register(app, route_base = '/api/project/')
    ActionController.register(app, route_base = '/api/action/')
    TransactionController.register(app, route_base = '/api/transaction/')
    BCController.register(app, route_base = '/api/bc/')
    SCController.register(app, route_base = '/api/sc/')
    app.run(debug = True, port = 9632)