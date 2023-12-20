import bcrypt
class Hash:

    def __init__(self, password):
        self.password = password

    def hashed_password(self):
        hashed_password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt())
        return hashed_password.decode('utf-8')