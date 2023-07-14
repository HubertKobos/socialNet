from django.db import DatabaseError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..features.feature_functions import decode_token
from ..models.models import UserAccount, FriendRequest, GroupRequest, BaseRequest
from ..serializers.user_serializers import SimpleUserSerializer
from django.shortcuts import get_object_or_404

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friend_request_create(request, pk):
    '''
    Create a friend request from authenticated user to user of id = pk
    '''
    authenticated_user = request.user
    friend_to_invite = get_object_or_404(UserAccount, id=pk)
    if FriendRequest.objects.filter(request_from=authenticated_user, request_to=friend_to_invite).exists():
        return Response({"message": "Friend request already exists"}, status=status.HTTP_400_BAD_REQUEST)
    FriendRequest.objects.create(request_from=authenticated_user, request_to=friend_to_invite)
    return Response(status=status.HTTP_201_CREATED)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friend_request_accept(request, pk):
    authenticated_user = request.user
    friend_to_accept = get_object_or_404(UserAccount, id=pk)
    friend_request = get_object_or_404(FriendRequest, (Q(request_from=authenticated_user, request_to=friend_to_accept) | Q(request_from=friend_to_accept, request_to=authenticated_user)))
    authenticated_user.friends.add(friend_to_accept)
    friend_to_accept.friends.add(authenticated_user)
    friend_request.delete()
    serializer = SimpleUserSerializer(friend_to_accept)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friend_request_decline(request, pk):
    authenticated_user = request.user
    friend_to_decline = get_object_or_404(UserAccount, id=pk)
    friend_request = get_object_or_404(FriendRequest, request_from=authenticated_user, request_to=friend_to_decline)
    friend_request.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_request_create(request, pk):
    authenticated_user = request.user
    user_to_invite = get_object_or_404(UserAccount, id=pk)
    if GroupRequest.objects.filter(request_from=authenticated_user, request_to=user_to_invite).exists():
        return Response({"message": "Group request already exists"}, status=status.HTTP_400_BAD_REQUEST)
    GroupRequest.objects.create(request_from=authenticated_user, request_to=user_to_invite)
    return Response(status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_request_accept(request, pk):
    authenticated_user = request.user
    user_to_accept = get_object_or_404(UserAccount, id=pk)
    group_request = get_object_or_404(GroupRequest, request_from=authenticated_user, request_to=user_to_accept)
    authenticated_user.groups.add(user_to_accept)
    user_to_accept.groups.add(authenticated_user)
    group_request.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_request_decline(request, pk):
    authenticated_user = request.user
    user_to_decline = get_object_or_404(UserAccount, id=pk)
    group_request = get_object_or_404(GroupRequest, request_from=authenticated_user, request_to=user_to_decline)
    group_request.delete()
    return Response(status=status.HTTP_200_OK)