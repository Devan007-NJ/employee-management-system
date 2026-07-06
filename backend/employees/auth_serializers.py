from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    role = serializers.ChoiceField(choices=['admin', 'employee'])

    def to_representation(self, instance):
        instance['_id'] = str(instance['_id'])
        instance.pop('password', None)  # Remove password from the representation
        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True)