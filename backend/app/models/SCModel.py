import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from app.helpers.ModelHelper import ModelHelper
from bson import ObjectId

class SCModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "sc"
        self.modelHelper = ModelHelper()

    def add(self, payload):
        try:
            is_sc_exists = self.is_sc_exists(payload["contractName"])

            if not is_sc_exists:
                return self.db.insert_one(self.collection, payload).inserted_id
            return 409
        except:
            return False

    def is_sc_exists(self, contractName):
        try:
            where = {
                "contractName": contractName,
            }
            
            return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
        except: 
            return False