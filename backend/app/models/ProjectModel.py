import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from app.helpers.ModelHelper import ModelHelper
from bson import ObjectId

class ProjectModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "projects"
        self.modelHelper = ModelHelper()

    def get(self, userID):
        try:
            where = {
                "userID": userID
            }

            return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
        except:
            return False

    def getById(self, projectID):
        try:
            where = {
                "_id": ObjectId(projectID)
            }

            return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
        except:
            return 400

    def add(self, payload):
        try:
            is_project_exists = self.is_project_exists(payload["projectName"])

            if not is_project_exists:
                self.db.insert_one(self.collection, payload)
                return True
            return False
        except:
            return False

    def is_project_exists(self, projectName):
        try:
            where = {
                "projectName": projectName
            }
            
            return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
        except: 
            return False

    def delete(self, id):
        try:
            where = {
                "_id": ObjectId(id)
            }

            return self.db.delete_one(self.collection, where)
        except:
            return False

    def update(self, payload):
        try:
            if "projectName" in payload and self.is_project_exists(payload["projectName"]):
                return 409

            where = {
                "_id": ObjectId(payload["id"])
            }

            del payload["id"]

            update_data = {
                '$set': payload
            }

            return self.db.update_one(self.collection, update_data, where)
        except:
            return False