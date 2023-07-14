from ..models.models import UserAccount
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user_serializers import SimpleUserSerializer
from django.shortcuts import get_object_or_404

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteFriend(request, pk):
    authenticated_user = request.user
    user_to_delete = get_object_or_404(UserAccount, pk=pk)
    authenticated_user.friends.remove(user_to_delete)
    authenticated_user.save()
    user_to_delete.friends.remove(authenticated_user)
    user_to_delete.save()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getFriendList(request):
    user = request.user
    
    if user.friends.exists():
        serializer = SimpleUserSerializer(user.friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response([], status=status.HTTP_204_NO_CONTENT)