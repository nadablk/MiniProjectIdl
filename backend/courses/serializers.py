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
        # Fetch student name from Spring Boot API directly
        try:
            # Use Spring Boot API directly (works in both local and deployed environments)
            spring_boot_url = os.getenv('SPRING_BOOT_URL', 'https://miniprojectidl-13.onrender.com')
            
            response = requests.get(
                f"{spring_boot_url}/api/students/{obj.student_id}",
                headers={"Content-Type": "application/json"},
                timeout=5
            )
            
            if response.status_code == 200:
                student = response.json()
                first_name = student.get('firstName', '')
                last_name = student.get('lastName', '')
                if first_name or last_name:
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