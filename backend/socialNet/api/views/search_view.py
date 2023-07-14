from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from ..models.models import UserAccount, Tag, Group
from ..serializers.tag_serializers import TagSerializer
from ..serializers.user_serializers import SimpleUserSerializer
from ..serializers.group_serializer import SimpleGroupSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOnSearch(request, to_search):
    '''
    View to handle search functionality. Based on dynamic value from URL looks for tags and groups in database 
    '''
    if to_search[0] == '_':
        to_search = to_search[1:]
        tags = Tag.objects.filter(name__icontains=to_search)
        if not tags.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = TagSerializer(tags, many=True)
        return Response({"tags": serializer.data}, status=status.HTTP_200_OK)
    else:
        groups = Group.objects.filter(name__icontains=to_search)
        if not groups.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = SimpleGroupSerializer(groups, many=True)
        return Response({"groups": serializer.data}, status=status.HTTP_200_OK)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def searchUsers(request, search_users):
    '''
    View to handle search functionality. Based on dynamic value from URL looks for people in database
    '''
    try:
        # TODO: this looks for only first_name or only last_name so inputs like john doe won't work but just john or just doe will, repair it later
        people = UserAccount.objects.filter(Q(first_name__icontains=search_users) | Q(last_name__icontains=search_users))
        if not people.exists():
            return Response([], status=status.HTTP_200_OK)
        serializer = SimpleUserSerializer(people, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)