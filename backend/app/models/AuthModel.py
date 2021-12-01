import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from werkzeug.security import generate_password_hash, check_password_hash
from app.helpers.ModelHelper import ModelHelper
from bson import ObjectId

class AuthModel():
    def __init__(self):
        self.db = MongoDB()
        self.collection = "users"
        self.modelHelper = ModelHelper()

    def add_user(self, payload):
        is_user_exists = self.is_user_exists(payload["username"])

        if not is_user_exists:
            payload["password"] = generate_password_hash(payload["password"])
            self.db.insert_one(self.collection, payload)
            
            return True
        return False

    def is_user_exists(self, username):
        where = {
            "username": username
        }
        
        return self.modelHelper.cursor_to_json(self.db.find(self.collection, where))
    
    def edit_profile(self, user, payload):
        try:
            where = {
                "_id": ObjectId(user["userID"])
            }

            update_data = {
                '$set': payload
            }

            return self.db.update_one(self.collection, update_data, where)
        except:
            return False

    def get_user_by_id(self, userID):
        try:
            return self.modelHelper.cursor_to_json(self.db.find_by_columns(
                self.collection, 
                {"_id": ObjectId(userID)}, 
                {"password": 0}
                )
            )
        except:
            return False