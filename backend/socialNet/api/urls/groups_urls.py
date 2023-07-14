from django.urls import path
from ..views.group_views import getGroups, createGroup, getGroup, getGroupsBasedOnPk, addMember, deleteMember, deleteGroup

urlpatterns = [
    path('get-groups/', getGroups),
    path('get-groups/<str:pk>/', getGroupsBasedOnPk),
    path('get-group/<str:pk>', getGroup),
    path('add-member/', addMember),
    path('delete-member/', deleteMember),
    path('delete-group/<str:pk>/', deleteGroup),
    path('create/', createGroup),
]
