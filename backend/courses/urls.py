from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, StudentCourseViewSet
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from .schema import schema

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', StudentCourseViewSet, basename='studentcourse')

urlpatterns = [
    path('', include(router.urls)),
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]
