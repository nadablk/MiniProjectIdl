from rest_framework import serializers
from .models import Course, StudentCourse


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'credits', 'instructor', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentCourseSerializer(serializers.ModelSerializer):
    student = serializers.IntegerField(source='student_id')
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    grade = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    enrollment_date = serializers.DateField()
    
    class Meta:
        model = StudentCourse
        fields = ['id', 'student', 'course', 'grade', 'enrollment_date', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def to_representation(self, instance):
        # When returning data, send course ID instead of full object
        representation = super().to_representation(instance)
        representation['course'] = instance.course.id
        return representation
    
    def create(self, validated_data):
        # Handle the source mapping
        student_id = validated_data.pop('student_id')
        validated_data['student_id'] = student_id
        # Set default status and other required fields
        validated_data['status'] = 'ENROLLED'
        if 'grade' not in validated_data or not validated_data['grade']:
            validated_data['grade'] = None
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Handle the source mapping
        if 'student_id' in validated_data:
            instance.student_id = validated_data.pop('student_id')
        return super().update(instance, validated_data)