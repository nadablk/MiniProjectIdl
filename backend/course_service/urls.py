from django.contrib import admin
from django.urls import path, include
from courses.schema import schema
from graphene_django.views import GraphQLView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),  # Ajouter cette ligne
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),
]