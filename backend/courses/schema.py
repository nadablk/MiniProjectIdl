import graphene
from graphene_django import DjangoObjectType
from .models import Course  # your Course model

class CourseType(DjangoObjectType):
    class Meta:
        model = Course
        fields = '__all__'

class Query(graphene.ObjectType):
    all_courses = graphene.List(CourseType)
    course = graphene.Field(CourseType, id=graphene.Int())

    def resolve_all_courses(self, info):
        return Course.objects.all()

    def resolve_course(self, info, id):
        return Course.objects.get(pk=id)

class AddStudentToCourse(graphene.Mutation):
    class Arguments:
        student_id = graphene.Int(required=True)
        course_id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    course = graphene.Field(CourseType)

    def mutate(self, info, student_id, course_id):
        try:
            # Get the course from YOUR database
            course = Course.objects.get(pk=course_id)
            
            # Make API call to students service to verify student exists
            # OR just store the student_id in your enrollment table
            
            # Add to enrollment/junction table
            # Example: course.enrolled_students.add(student_id)
            # OR create an Enrollment record
            
            return AddStudentToCourse(
                success=True,
                message="Student added to course successfully",
                course=course
            )
        except Course.DoesNotExist:
            return AddStudentToCourse(
                success=False,
                message="Course not found",
                course=None
            )
        except Exception as e:
            return AddStudentToCourse(
                success=False,
                message=str(e),
                course=None
            )

class Mutation(graphene.ObjectType):
    add_student_to_course = AddStudentToCourse.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)