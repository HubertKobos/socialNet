from django.urls import path
from ..views.news_api_views import getNews

urlpatterns = [
    path('', getNews)
]
