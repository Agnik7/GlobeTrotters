import os
from datetime import datetime, timedelta
import jwt

class Authenticate:
    def __init__(self, email, password):
        self.email = email
        self.password = password
    


    def generate_token(self, uid):
        expire= timedelta(hours=1)
        session_duration = datetime.utcnow() + expire
        payload = {
            '_id': str(uid),
            'email': self.email,
            'exp': session_duration
        }
        return jwt.encode(payload, os.environ.get('AUTH_SECRET_KEY'), algorithm='HS256')