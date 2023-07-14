from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from ..models import Post, FriendRequest, GroupRequest, Group
from django.core.exceptions import ObjectDoesNotExist
# from ..serializers.post_serializers import PostSerializer
from django_countries.serializer_fields import CountryField
from ..serializers.requests_serializers import GroupRequestSerializer, FriendRequestSerializer

User = get_user_model()

class CountrySerializer(serializers.Serializer):
    name = serializers.CharField()
    code = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    # isAdmin = serializers.SerializerMethodField(read_only=True)
    posts = serializers.SerializerMethodField(read_only=True)
    # number_of_followings = serializers.SerializerMethodField(read_only=True)
    # number_of_followers = serializers.SerializerMethodField(read_only=True)
    is_friend = serializers.SerializerMethodField(read_only=True)
    authenticated_user = serializers.SerializerMethodField(read_only=True)
    friend_invitation_exists = serializers.SerializerMethodField(read_only=True)
    friend_invitation_from_requested_user_exists = serializers.SerializerMethodField(read_only=True)
    number_of_friends= serializers.SerializerMethodField(read_only=True)
    number_of_groups=serializers.SerializerMethodField(read_only=True)

    country = CountrySerializer()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'nick_name', 'bio', 
                  'date_of_birth', 'number_of_posts', 'posts', 'number_of_friends', 'number_of_groups',
                  'is_friend', 'authenticated_user', 'friend_invitation_exists',
                  'friend_invitation_from_requested_user_exists', 'avatar', 'city', 'country']
    
    def get_posts(self, obj):
        from .post_serializers import PostSerializer
        auth_user = self.context.get('authenticated_user')
        posts = Post.objects.filter(created_by=obj)[::-1][:20] # return last 20 posts
        serializer = PostSerializer(posts, many=True, context = {"authenticated_user": auth_user},)
        return serializer.data
    
    def get_number_of_friends(self, obj):
        return obj.friends.count()

    def get_number_of_groups(self, obj):
        number_of_groups_user_is_member_of = Group.objects.filter(participants=obj).count()
        return obj.groups.count() + number_of_groups_user_is_member_of


    def get_is_friend(self, obj):
        # TODO: Test it if this works !
        auth_user = self.context.get('authenticated_user')
        if auth_user in obj.friends.all():
            return True
        else: return False

    def get_authenticated_user(self, obj):
        '''
        Returns true if requested user is the authenticated user
        '''
        auth_user = self.context.get('authenticated_user')
        if auth_user == obj:
            return True
        else: return False
        
    def get_friend_invitation_exists(self, obj):
        '''
        Returns true if friend invitation from authenticated user to requested exists in database
        '''
        auth_user = self.context.get('authenticated_user')
        try:
            friend_request = FriendRequest.objects.get(request_from=auth_user, request_to=obj)
            if friend_request: return True
            else: return False
        except ObjectDoesNotExist:
            return False
    
    def get_friend_invitation_from_requested_user_exists(self, obj):
        '''
        Returns true if friend invitation from requested user to authenticated user exists in database
        '''
        auth_user = self.context.get('authenticated_user')
        try:
            friend_request = FriendRequest.objects.get(request_from=obj, request_to=auth_user)
            if friend_request: return True
            else: return False
        except ObjectDoesNotExist:
            return False

# TODO: Followers, Following serializers
    
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'avatar', 'nick_name']

class UserSerializerWithToken(UserSerializer):
    '''
    Used to load into redux on frontend
    '''
    token = serializers.SerializerMethodField(read_only=True)
    isAuthenticated = serializers.SerializerMethodField(read_only=True)
    friends = UserSerializer(many=True, read_only=True)
    friends_invitation = serializers.SerializerMethodField(read_only=True)
    group_invitation = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'nick_name', 'bio', 'date_of_birth', 'is_admin', 'token', 'isAuthenticated', 'friends', 'avatar', 'friends_invitation', 'group_invitation']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
    def get_isAuthenticated(self, obj):
        return True
    
    def get_friends_invitation(self, obj):
        auth_user = obj
        friend_requests = FriendRequest.objects.filter(request_to=auth_user)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return serializer.data

    def get_group_invitation(self, obj):
        auth_user = obj
        group_requests = GroupRequest.objects.filter(request_to=auth_user)
        serializer = GroupRequestSerializer(group_requests, many=True)
        return serializer.data