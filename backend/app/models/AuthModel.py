import json
from core.databases.MongoDB import MongoDB
from bson.json_util import loads, dumps
from werkzeug.security import generate_password_hash, check_password_hash
from app.helpers.ModelHelper import ModelHelper

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