from django.urls import path
from ..views.friends_views import deleteFriend, getFriendList

urlpatterns = [
    path("delete/<str:pk>", deleteFriend),
    path("friend-list", getFriendList)
]
