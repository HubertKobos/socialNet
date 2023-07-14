from django.contrib import admin
from .models.models import UserAccount, Post, Answer, Tag, Group, FriendRequest, GroupRequest

admin.site.register(UserAccount)
admin.site.register(Post)
admin.site.register(Answer)
admin.site.register(Tag)
admin.site.register(Group)
admin.site.register(FriendRequest)
admin.site.register(GroupRequest)