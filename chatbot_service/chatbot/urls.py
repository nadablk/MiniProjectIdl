from django.urls import path
from .views import TranslateView, SummarizeView, HealthCheckView
from .auth_views import register, login, user_profile, logout, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('translate/', TranslateView.as_view(), name='translate'),
    path('summarize/', SummarizeView.as_view(), name='summarize'),
    path('health/', HealthCheckView.as_view(), name='health'),
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/profile/', user_profile, name='user_profile'),
    path('auth/logout/', logout, name='logout'),
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]