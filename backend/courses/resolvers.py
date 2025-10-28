from .models import Course, Enrollment
import graphene
from graphene_django.types import DjangoObjectType


class CourseResolvers:
    @staticmethod
    def resolve_all_courses(root, info):
        return Course.objects.all()

    @staticmethod
    def resolve_course(root, info, id):
        try:
            return Course.objects.get(pk=id)
        except Course.DoesNotExist:
            return None

    @staticmethod
    def resolve_course_by_name(root, info, name):
        try:
            return Course.objects.get(name=name)
        except Course.DoesNotExist:
            return None

    @staticmethod
    def resolve_all_enrollments(root, info):
        return Enrollment.objects.all()

    @staticmethod
    def resolve_enrollments_by_course(root, info, course_id):
        return Enrollment.objects.filter(course_id=course_id)

    @staticmethod
    def resolve_enrollments_by_student(root, info, student_id):
        return Enrollment.objects.filter(student_id=student_id)


class CourseMutations:
    @staticmethod
    def mutate_add_student_to_course(root, info, student_id, course_id):
        try:
            course = Course.objects.get(pk=course_id)
            
            if Enrollment.objects.filter(course=course, student_id=student_id).exists():
                return {
                    'success': False,
                    'message': 'Student is already enrolled in this course',
                    'enrollment': None
                }
            
            enrollment = Enrollment.objects.create(
                course=course,
                student_id=student_id
            )
            
            return {
                'success': True,
                'message': 'Student successfully enrolled',
                'enrollment': enrollment
            }
            
        except Course.DoesNotExist:
            return {
                'success': False,
                'message': 'Course not found',
                'enrollment': None
            }
        except Exception as e:
            return {
                'success': False,
                'message': str(e),
                'enrollment': None
            }

    @staticmethod
    def mutate_remove_student_from_course(root, info, student_id, course_id):
        try:
            enrollment = Enrollment.objects.get(
                course_id=course_id,
                student_id=student_id
            )
            enrollment.delete()
            
            return {
                'success': True,
                'message': 'Student removed from course'
            }
            
        except Enrollment.DoesNotExist:
            return {
                'success': False,
                'message': 'Enrollment not found'
            }
        except Exception as e:
            return {
                'success': False,
                'message': str(e)
            }

    @staticmethod
    def mutate_create_course(root, info, name, description=None):
        try:
            course = Course.objects.create(
                name=name,
                description=description
            )
            
            return {
                'success': True,
                'message': 'Course created successfully',
                'course': course
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': str(e),
                'course': None
            }

    @staticmethod
    def mutate_update_course(root, info, id, name=None, description=None):
        try:
            course = Course.objects.get(pk=id)
            
            if name:
                course.name = name
            if description:
                course.description = description
                
            course.save()
            
            return {
                'success': True,
                'message': 'Course updated successfully',
                'course': course
            }
            
        except Course.DoesNotExist:
            return {
                'success': False,
                'message': 'Course not found',
                'course': None
            }
        except Exception as e:
            return {
                'success': False,
                'message': str(e),
                'course': None
            }

    @staticmethod
    def mutate_delete_course(root, info, id):
        try:
            course = Course.objects.get(pk=id)
            course.delete()
            
            return {
                'success': True,
                'message': 'Course deleted successfully'
            }
            
        except Course.DoesNotExist:
            return {
                'success': False,
                'message': 'Course not found'
            }
        except Exception as e:
            return {
                'success': False,
                'message': str(e)
            }