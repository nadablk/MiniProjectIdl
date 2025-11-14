from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from courses.schema import schema
from graphene_django.views import GraphQLView

def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'Django Backend'})

urlpatterns = [
    path('health/', health_check),
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]