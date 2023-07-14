from django.urls import path
from ..views.search_view import getOnSearch, searchUsers
from ..views.tags_views import getPosts

urlpatterns = [
    path('tags_groups/q=<str:to_search>', getOnSearch),
    path('users/q=<str:search_users>', searchUsers),
    path('tags_posts/q=<str:tag_name>', getPosts)
]       
