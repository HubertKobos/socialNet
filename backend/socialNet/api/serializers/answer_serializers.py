from rest_framework import serializers
from .user_serializers import SimpleUserSerializer
from ..models import Answer


class AnswersSerializer(serializers.ModelSerializer):
    created_by = SimpleUserSerializer(many=False)
    liked_by = SimpleUserSerializer(many=True)
    liked = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Answer
        fields = ["id", "created_by",'original_content', "created_at", "liked_by", "number_of_likes", 'liked']

    def get_liked(self, obj):
        user = self.context.get('authenticated_user')
        if user:
            is_ilked = obj.liked_by.filter(pk=user.id).exists()
            return is_ilked
        else:
            return False
