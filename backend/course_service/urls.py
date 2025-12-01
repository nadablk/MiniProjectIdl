from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from courses.schema import schema
from graphene_django.views import GraphQLView
from rest_framework_simplejwt.views import TokenRefreshView
from courses.auth_views import CustomTokenObtainPairView, register, login, user_profile, logout

def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'Django Backend'})

urlpatterns = [
    path('health/', health_check),
    path('admin/', admin.site.urls),
    # Authentication endpoints
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/profile/', user_profile, name='user_profile'),
    path('auth/logout/', logout, name='logout'),
    # API endpoints
    path('api/', include('courses.urls')),
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]