from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models import UserAccount, Group
from ..serializers.group_serializer import GroupSerializer, SimpleGroupSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getGroups(request):
    '''
    Return all the groups for the authenticated user
    '''
    user = request.user
    groups = set(user.groups.all())
    group_user_is_member_of = set(Group.objects.filter(participants=user))
    unique_groups = groups.union(group_user_is_member_of)
    serializer = SimpleGroupSerializer(unique_groups, many=True, context={"auth_user": user})
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addMember(request):
    '''
    Add new member to the group
    '''
    group_id = request.data.get('group_id')
    user_to_add_id = request.data.get('user_to_add_id')

    user_to_add = get_object_or_404(UserAccount, pk=user_to_add_id)
    group = get_object_or_404(Group, pk=group_id)

    group.participants.add(user_to_add)
    group.save()

    return Response(status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deleteMember(request):
    '''
    Delete member of the group
    '''
    group_id = request.data.get('group_id')
    user_to_delete_id = request.data.get('user_to_delete_id')

    user_to_delete = get_object_or_404(UserAccount, pk=user_to_delete_id)
    group = get_object_or_404(Group, pk=group_id)

    group.participants.remove(user_to_delete)
    group.save()

    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def deleteGroup(request, pk):
    '''
    Delete group
    '''
    user = request.user
    try:
        group_to_delete = Group.objects.get(pk=pk)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if group_to_delete.created_by == user:
        group_to_delete.delete()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getGroupsBasedOnPk(request, pk):
    '''
    Get groups for the user of id = pk
    '''
    try:
        user = UserAccount.objects.get(pk=pk)
    except UserAccount.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    groups_user_is_member_of = Group.objects.filter(participants=user)
    if user.groups.exists() or groups_user_is_member_of.exists():
        serializer = SimpleGroupSerializer(user.groups, many=True, context={"auth_user": user})
        serializer_of_groups_user_is_member_of = SimpleGroupSerializer(groups_user_is_member_of, many=True, context={"auth_user": user})
        serializer_data = serializer_of_groups_user_is_member_of.data + serializer.data
        return Response(serializer_data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createGroup(request):
    '''
    Create group
    '''
    user = request.user
    if Group.objects.filter(name=request.data.get('name')).exists():
        return Response({"error": "Group with given name already exists"}, status=status.HTTP_409_CONFLICT)
    instance = Group.objects.create(
        name=request.data.get('name'),
        created_by=user,
        is_private=request.data.get('isPrivate')
    )
    instance.participants.add(user)
    instance.save()
    user.groups.add(instance)
    user.save()

    return Response(status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(["GET"])
def getGroup(request, pk):
    '''
    Return specific group if the user has permissions for the group
    '''
    user = request.user
    try:
        group = Group.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
    if group.participants.contains(user):
        serializer = GroupSerializer(group, many=False, context={"auth_user": user})
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)


    