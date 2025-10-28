import graphene
from graphene_django import DjangoObjectType
from .models import Course, Enrollment
from .resolvers import CourseResolvers, CourseMutations


# Types
class CourseType(DjangoObjectType):
    class Meta:
        model = Course
        fields = '__all__'


class EnrollmentType(DjangoObjectType):
    class Meta:
        model = Enrollment
        fields = '__all__'


# Query
class Query(graphene.ObjectType):
    all_courses = graphene.List(CourseType)
    course = graphene.Field(CourseType, id=graphene.Int())
    course_by_name = graphene.Field(CourseType, name=graphene.String())
    all_enrollments = graphene.List(EnrollmentType)
    enrollments_by_course = graphene.List(EnrollmentType, course_id=graphene.Int())
    enrollments_by_student = graphene.List(EnrollmentType, student_id=graphene.Int())

    resolve_all_courses = CourseResolvers.resolve_all_courses
    resolve_course = CourseResolvers.resolve_course
    resolve_course_by_name = CourseResolvers.resolve_course_by_name
    resolve_all_enrollments = CourseResolvers.resolve_all_enrollments
    resolve_enrollments_by_course = CourseResolvers.resolve_enrollments_by_course
    resolve_enrollments_by_student = CourseResolvers.resolve_enrollments_by_student


# Mutations
class AddStudentToCourse(graphene.Mutation):
    class Arguments:
        student_id = graphene.Int(required=True)
        course_id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    enrollment = graphene.Field(EnrollmentType)

    def mutate(self, info, student_id, course_id):
        result = CourseMutations.mutate_add_student_to_course(
            None, info, student_id, course_id
        )
        return AddStudentToCourse(
            success=result['success'],
            message=result['message'],
            enrollment=result['enrollment']
        )


class RemoveStudentFromCourse(graphene.Mutation):
    class Arguments:
        student_id = graphene.Int(required=True)
        course_id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, student_id, course_id):
        result = CourseMutations.mutate_remove_student_from_course(
            None, info, student_id, course_id
        )
        return RemoveStudentFromCourse(
            success=result['success'],
            message=result['message']
        )


class CreateCourse(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()

    success = graphene.Boolean()
    message = graphene.String()
    course = graphene.Field(CourseType)

    def mutate(self, info, name, description=None):
        result = CourseMutations.mutate_create_course(
            None, info, name, description
        )
        return CreateCourse(
            success=result['success'],
            message=result['message'],
            course=result['course']
        )


class UpdateCourse(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()

    success = graphene.Boolean()
    message = graphene.String()
    course = graphene.Field(CourseType)

    def mutate(self, info, id, name=None, description=None):
        result = CourseMutations.mutate_update_course(
            None, info, id, name, description
        )
        return UpdateCourse(
            success=result['success'],
            message=result['message'],
            course=result['course']
        )


class DeleteCourse(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, id):
        result = CourseMutations.mutate_delete_course(None, info, id)
        return DeleteCourse(
            success=result['success'],
            message=result['message']
        )


class Mutation(graphene.ObjectType):
    add_student_to_course = AddStudentToCourse.Field()
    remove_student_from_course = RemoveStudentFromCourse.Field()
    create_course = CreateCourse.Field()
    update_course = UpdateCourse.Field()
    delete_course = DeleteCourse.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)