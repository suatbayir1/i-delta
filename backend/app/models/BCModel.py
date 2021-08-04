import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from app.helpers.ModelHelper import ModelHelper
from bson import ObjectId

class BCModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "bc"
        self.modelHelper = ModelHelper()
    
    def add(self, payload):
        try:
            is_bc_exists = self.is_bc_exists(payload["bcName"])

            if not is_bc_exists:
                return self.db.insert_one(self.collection, payload).inserted_id
            return 409
        except:
            return False

    def is_bc_exists(self, bcName):
        try:
            where = {
                "bcName": bcName,
            }
            
            return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
        except: 
            return False