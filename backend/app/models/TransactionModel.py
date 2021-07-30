import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from app.helpers.ModelHelper import ModelHelper
from bson import ObjectId

class TransactionModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "actions"
        self.modelHelper = ModelHelper()

    def add(self, payload):
        try:
            where = {
                "_id": ObjectId(payload["actionID"])
            }

            del payload["actionID"]

            update_data = {
                '$push': {'transactions': payload}
            }

            return self.db.update_one(self.collection, update_data, where)
        except:
            return False

    def delete(self, payload):
        try:
            where = {
                "_id": ObjectId(payload["actionID"])
            }

            update_data = {
                '$pull': {'transactions': {"id": payload["transactionID"]}}
            }
            
            return self.db.update_one(self.collection, update_data, where)
        except:
            return False