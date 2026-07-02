from django.test import TestCase

from .serializers import EmployeeSerializer


class EmployeeSerializerTests(TestCase):
    def test_serializer_accepts_payload_without_salary_and_with_join_date(self):
        payload = {
            "name": "John Doe",
            "email": "john@company.com",
            "department": "Engineering",
            "role": "Developer",
            "join_date": "2026-01-15",
        }

        serializer = EmployeeSerializer(data=payload)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["join_date"], "2026-01-15")
        self.assertNotIn("salary", serializer.validated_data)
