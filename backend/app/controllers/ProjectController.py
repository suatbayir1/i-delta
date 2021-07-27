from flask import Flask, jsonify, request, Response
from flask_classful import FlaskView, route
from app.middlewares.ApiBase import ApiBase
from app.config import required_keys, request_keys, response_messages, secret
from app.models.ProjectModel import ProjectModel
from app.helpers.HelperFunctions import token_control
import datetime

class ProjectController(FlaskView, ApiBase):
    def __init__(self):
        self.projectModel = ProjectModel()

    @route("get", methods = ["GET"])
    @token_control(roles = ["admin", "member"])
    def get(self, user):
        try:    
            result = self.projectModel.get(user["userID"])

            if not result:
                raise Exception('Error')

            return ApiBase.response(self, data = result, message = response_messages.get_projects["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400

    @route("getById", methods = ["POST"])
    @token_control(roles = ["admin", "member"])
    def getById(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.project["getById"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400
            
            result = self.projectModel.getById(request.json["id"])

            if result == 400:
                raise Exception('Error')

            return ApiBase.response(self, data = result, message = response_messages.getById_project["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400

    @route("add", methods = ["POST"])
    @token_control(roles = ["admin", "member"])
    def add(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.project["add"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.project["add"])
            payload["createdAt"] = payload["updatedAt"] = datetime.datetime.now()

            result = self.projectModel.add(payload)

            if not result:
                return ApiBase.response(self, message = response_messages.add_project["already_exists"]), 409
            
            return ApiBase.response(self, message = response_messages.add_project["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400

    @route("delete", methods = ["DELETE"])
    @token_control(roles = ["admin", "member"])
    def delete(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.project["delete"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            result = self.projectModel.delete(request.json["id"])

            if not result:
                return ApiBase.response(self, message = response_messages.delete_project["error"]), 400

            return ApiBase.response(self, message = response_messages.delete_project["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400

    @route("clone", methods = ["POST"])
    @token_control(roles = ["admin", "member"])
    def clone(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.project["clone"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.project["clone"])
            payload["createdAt"] = payload["updatedAt"] = datetime.datetime.now()

            temp_name = payload["projectName"]
            i = 1
            while True:
                payload["projectName"] = f"{temp_name} (clone {i})"
                result = self.projectModel.add(payload)

                if result:
                    break
                i += 1

            if not result:
                return ApiBase.response(self, message = response_messages.add_project["already_exists"]), 409
            
            return ApiBase.response(self, message = response_messages.clone_project["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400

    
    @route("update", methods = ["PUT"])
    @token_control(roles = ["admin", "member"])
    def update(self, user):
        try:
            missed_keys, confirm = ApiBase.request_validation(self, request.json, required_keys.project["update"])

            if not confirm:
                return ApiBase.response(self, message = f"{missed_keys} {response_messages.general['payload_empty']}"), 400

            payload = ApiBase.check_request_params(self, request.json, request_keys.project["update"])
            payload["updatedAt"] = datetime.datetime.now()

            result = self.projectModel.update(payload)

            if result == 409:
                return ApiBase.response(self, message = response_messages.add_project["already_exists"]), 409
            elif not result:
                return ApiBase.response(self, message = response_messages.update_project["error"]), 400
            
            return ApiBase.response(self, message = response_messages.update_project["success"]), 200
        except:
            return ApiBase.response(self, message = response_messages.general["unexpected_error"]), 400