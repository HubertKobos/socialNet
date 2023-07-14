from rest_framework import serializers
from ..models.models import Group
from .post_serializers import PostSerializer

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class SimpleGroupSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.SerializerMethodField(read_only=True)
    created_by_name = serializers.SerializerMethodField(read_only=True)
    created_by_id = serializers.SerializerMethodField(read_only=True)
    is_auth_user_member_of = serializers.SerializerMethodField(read_only=True)
    is_auth_user_creator_of_group = serializers.SerializerMethodField(read_only=True)
    

    class Meta: 
        model = Group
        fields = ['id', 'name', 'number_of_participants', 'created_by_name', 'created_by_id', 'is_private', 'is_auth_user_member_of', 'is_auth_user_creator_of_group']

    def get_is_auth_user_creator_of_group(self, obj):
        auth_user = self.context.get('auth_user')
        return obj.created_by == auth_user

    def get_is_auth_user_member_of(self, obj):
        auth_user = self.context.get('auth_user')
        return auth_user in obj.participants.all()
        

    def get_number_of_participants(self, obj):
        return obj.participants.count()
    
    def get_created_by_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}"
    
    def get_created_by_id(self, obj):
        return obj.created_by.id
    
class GroupSerializer(SimpleGroupSerializer):
    posts = serializers.SerializerMethodField()

    def get_posts(self, group):
        posts = group.posts.order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return serializer.data
    
    class Meta:
        model = Group
        fields = SimpleGroupSerializer.Meta.fields + ['posts']
        