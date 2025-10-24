from rest_framework import serializers
from .models import Course, StudentCourse


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
        # You'll need to fetch student name from Spring Boot API or store it locally
        # For now, return the student_id as a placeholder
        return f"Student {obj.student_id}"
    
    def create(self, validated_data):
        validated_data['status'] = 'ENROLLED'
        if 'grade' not in validated_data or not validated_data['grade']:
            validated_data['grade'] = None
        return super().create(validated_data)