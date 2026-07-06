import bcrypt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .db import users_collection
from .auth_serializers import UserSerializer,LoginSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user_data = serializer.validated_data
        # Hash the password before storing it
        hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
        user_data['password'] = hashed_password.decode('utf-8')
        
        # Insert the user into the database
        result = users_collection.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)  # Add the generated ID to the response
        
        return Response(UserSerializer(user_data).data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user_data = serializer.validated_data
        user = users_collection.find_one({'username': user_data['username']})

        if user and bcrypt.checkpw(user_data['password'].encode('utf-8'), user['password'].encode('utf-8')):
            refresh = RefreshToken()
            refresh['user_id'] = str(user['_id'])
            refresh['role'] = user['role']
            refresh['email'] = user.get('email')

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data,
            })

        return Response({'error': 'Invalid credentials'}, status=401)
    return Response(serializer.errors, status=400)
