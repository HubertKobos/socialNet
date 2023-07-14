from rest_framework.urls import path
from ..views.requests_views import (friend_request_accept, friend_request_create, 
                                    friend_request_decline, group_request_accept, 
                                    group_request_create, group_request_decline)

urlpatterns = [
    path('friend/invite/<str:pk>/', friend_request_create),
    path('friend/accept/<str:pk>/', friend_request_accept),
    path('friend/decline/<str:pk>/', friend_request_decline),

    path('group/invite/<str:pk>', group_request_create),
    path('group/accept/<str:pk>', group_request_accept),
    path('group/decline/<str:pk>', group_request_decline),
]
