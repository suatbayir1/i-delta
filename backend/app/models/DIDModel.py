import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from app.helpers.ModelHelper import ModelHelper
from bson import ObjectId

class DIDModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "did"
        self.modelHelper = ModelHelper()
    
    def generate(self, payload):
        try:
            is_email_exists = self.is_email_exists(payload["email"])

            if not is_email_exists:
                return self.db.insert_one(self.collection, payload).inserted_id
            return 409
        except:
            return False
                
    def is_email_exists(self, email):
        try:
            where = {
                "email": email,
            }
            
            return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
        except: 
            return False