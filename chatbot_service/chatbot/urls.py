from django.urls import path
from .views import TranslateView, SummarizeView, HealthCheckView

urlpatterns = [
    path('translate/', TranslateView.as_view(), name='translate'),
    path('summarize/', SummarizeView.as_view(), name='summarize'),
    path('health/', HealthCheckView.as_view(), name='health'),
]