from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..serializers.user_serializers import UserSerializer, UserSerializerWithToken
from django.db.utils import IntegrityError
from django.contrib.auth import get_user_model
from ..features.feature_functions import  get_avatar_link

from django.shortcuts import get_object_or_404

User = get_user_model()

@api_view(["POST"])
def registerUser(request):
    '''
    Register new user and return his data with JWT token
    '''
    data = request.data
    try:
        user = User.objects.create_user(
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            nick_name=data.get('nick_name'),
            bio=data.get('bio'),
            date_of_birth=data.get('date_of_birth'),
            password=data.get('password')
        )

        user.save()
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except IntegrityError:
        message = {
            'detail': 'User with this email already exists'
        }
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    '''
    Return currently authenticated user informations
    '''
    user = request.user
    serializer = UserSerializer(user, many=False, context={'authenticated_user':user})
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfileBasedOnUrl(request, pk):
    '''
    Return user informations based on pk
    '''
    user_profile = get_object_or_404(User, pk=pk)
    authenticated_user = request.user
    serializer = UserSerializer(user_profile, context={'authenticated_user':authenticated_user})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def getAllUserProfiles(request):
    '''
    Return all the users from database
    '''
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def editProfileData(request):
    '''
    Edit user data 
    '''
    authenticated_user = request.user
    data = request.data
    avatar = request.FILES.get('avatar')
    for field, value in data.items():
        if value != "" and value != "avatar":
            setattr(authenticated_user, field, value)
    
    if avatar and avatar!="undefined" and avatar!="":
        authenticated_user.avatar = avatar
    authenticated_user.save()
    url = get_avatar_link(authenticated_user.avatar)
    
    if(url):
        return Response({"updated_avatar_url": url}, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_200_OK)

