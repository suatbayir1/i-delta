import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from app.helpers.ModelHelper import ModelHelper
from bson import ObjectId

class ActionModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "actions"
        self.modelHelper = ModelHelper()

    def add(self, payload):
        try:
            is_action_exists = self.is_action_exists(payload["actionName"])

            if not is_action_exists:
                self.db.insert_one(self.collection, payload)
                return True
            return 409
        except:
            return False

    def is_action_exists(self, actionName):
        try:
            where = {
                "actionName": actionName
            }
            
            return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
        except: 
            return False