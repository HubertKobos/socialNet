from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('api.urls.user_urls')),
    path('api/posts/', include('api.urls.post_urls')),
    path('api/polish-news', include('api.urls.news-api_urls')),
    path('api/search/', include('api.urls.search_urls')),
    path('api/group/', include('api.urls.groups_urls')),
    path('api/request/', include('api.urls.requests_urls')),
    path('api/friends/', include('api.urls.friends_urls')),
    path('api/answers/', include('api.urls.answers_urls')),
]
