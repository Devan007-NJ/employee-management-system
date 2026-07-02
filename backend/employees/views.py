
from rest_framework.decorators import api_view
from rest_framework.response import Response
from bson import ObjectId
from bson.errors import InvalidId
from .db import employees_collection
from .serializers import EmployeeSerializer


# Create your views here.
@api_view(['GET', 'POST'])
def employee_list(request):
    if request.method == 'GET':
        if request.user.role == 'admin':
            employees = list(employees_collection.find())
        else:
            employees = list(employees_collection.find({'email': request.user.email}))
        return Response(EmployeeSerializer(employees, many=True).data)

    # POST — admin only
    if request.user.role != 'admin':
        return Response({'error': 'Only admins can create employee records'}, status=403)

    serializer = EmployeeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    employee_data = serializer.validated_data
    employee_data['salary'] = float(employee_data['salary'])

    result = employees_collection.insert_one(employee_data)
    employee_data['_id'] = str(result.inserted_id)

    return Response(EmployeeSerializer(employee_data).data, status=201)

@api_view(['GET', 'PUT', 'DELETE'])
def employee_detail(request, employee_id):
    try:
        obj_id = ObjectId(employee_id)
    except InvalidId:
        return Response({'error': 'Invalid employee ID'}, status=400)

    employee = employees_collection.find_one({'_id': obj_id})
    if not employee:
        return Response({'error': 'Employee not found'}, status=404)

    is_admin = request.user.role == 'admin'
    is_own_record = employee.get('email') == request.user.email

    if not is_admin and not is_own_record:
        return Response({'error': 'You do not have permission to access this record'}, status=403)

    if request.method == 'GET':
        return Response(EmployeeSerializer(employee).data)

    if request.method == 'DELETE':
        if not is_admin:
            return Response({'error': 'Only admins can delete employee records'}, status=403)
        employees_collection.delete_one({'_id': obj_id})
        return Response(status=204)

    # PUT
    serializer = EmployeeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    updated_data = serializer.validated_data
    updated_data['salary'] = float(updated_data['salary'])

    if not is_admin:
        # Employees can only change name and email — keep everything else as-is
        updated_data['department'] = employee['department']
        updated_data['role'] = employee['role']
        updated_data['salary'] = employee['salary']

    employees_collection.update_one({'_id': obj_id}, {'$set': updated_data})
    updated = employees_collection.find_one({'_id': obj_id})

    return Response(EmployeeSerializer(updated).data)