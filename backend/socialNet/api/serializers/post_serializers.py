from rest_framework import serializers
from ..models.models import Post, UserAccount
from .tag_serializers import TagSerializer
from .user_serializers import SimpleUserSerializer


class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    created_by = SimpleUserSerializer(many=False)
    liked = serializers.SerializerMethodField(read_only=True)
    isFavourite = serializers.SerializerMethodField(read_only=True)
    group_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'created_by', 'created_at', 'topic', 'content', 'tags', 'group_name', 'number_of_likes', 'number_of_answers', 'liked', 'isFavourite']

    def get_liked(self, obj):
        user = self.context.get('authenticated_user') 
        if user:
            # user = UserAccount.objects.get(pk=user.id)
            is_liked = obj.liked_by.filter(pk=user.id).exists()
            return is_liked
        else: return False

    def get_isFavourite(self, obj):

        # TODO: test it ! 
        '''
        Return true if the post is added to a favourite lists of posts of authenticated user
        '''
        user = self.context.get('authenticated_user') 
        # user_obj = UserAccount.objects.get(pk=user.id)
        if user:
            isFavourite = user.favouritePosts.filter(pk=obj.pk).exists()
            return isFavourite
        else:
            return False
        
    def get_group_name(self, obj):
        group = obj.group
        if group:
            return group.name
        else:
            return None
