# employees/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from .db import users_collection
from bson import ObjectId


class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        if not user_id:
            raise InvalidToken('Token contained no recognizable user identification')

        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if user is None:
            raise InvalidToken('User not found')

        # Simple object DRF can treat as an authenticated user
        class MongoUser:
            def __init__(self, data):
                self.id = str(data['_id'])
                self.username = data.get('username')
                self.email = data.get('email')
                self.role = data.get('role')
                self.is_authenticated = True

        return MongoUser(user)