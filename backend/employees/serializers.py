from rest_framework import serializers

class EmployeeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    role = serializers.CharField(max_length=100)
    department = serializers.CharField(max_length=100)
    salary = serializers.DecimalField(max_digits=10, decimal_places=2)

    def to_representation(self, instance):
        return {
            'id': str(instance['_id']),
            'name': instance['name'],
            'email': instance['email'],
            'role': instance['role'],
            'department': instance['department'],
            'salary': instance['salary']
        }
    