from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, StudentCourseViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', StudentCourseViewSet, basename='studentcourse')

urlpatterns = [
    path('', include(router.urls)),
]
