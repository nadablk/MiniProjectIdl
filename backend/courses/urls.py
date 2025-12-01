from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, StudentCourseViewSet
from .auth_views import register, login, user_profile, logout, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from .schema import schema

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', StudentCourseViewSet, basename='studentcourse')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/profile/', user_profile, name='user_profile'),
    path('auth/logout/', logout, name='logout'),
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]
