from rest_framework import serializers
from .models import Course, StudentCourse
import requests
import os


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'credits', 'instructor', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentCourseSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    course_name = serializers.CharField(source='course.name', read_only=True)
    student_name = serializers.SerializerMethodField()
    grade = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = StudentCourse
        fields = ['id', 'student_id', 'student_name', 'course', 'course_name', 'grade', 'enrollment_date', 'created_at']
        read_only_fields = ['id', 'created_at', 'student_name', 'course_name']
    
    def get_student_name(self, obj):
        # Fetch student name from Spring Boot API via Gateway
        try:
            # Use Gateway URL to reach Spring Boot service
            gateway_url = os.getenv('GATEWAY_URL', 'http://localhost:9091')
            
            # GraphQL query to get student by ID
            query = """
            query GetStudent($id: ID!) {
              student(id: $id) {
                firstName
                lastName
              }
            }
            """
            
            response = requests.post(
                f"{gateway_url}/graphql",
                json={
                    "query": query,
                    "variables": {"id": str(obj.student_id)}
                },
                headers={"Content-Type": "application/json"},
                timeout=2
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('data') and data['data'].get('student'):
                    student = data['data']['student']
                    first_name = student.get('firstName', '')
                    last_name = student.get('lastName', '')
                    return f"{first_name} {last_name}".strip()
        except Exception as e:
            # If API call fails, return placeholder
            print(f"Error fetching student name: {e}")
        return f"Student {obj.student_id}"
    
    def create(self, validated_data):
        validated_data['status'] = 'ENROLLED'
        if 'grade' not in validated_data or not validated_data['grade']:
            validated_data['grade'] = None
        return super().create(validated_data)