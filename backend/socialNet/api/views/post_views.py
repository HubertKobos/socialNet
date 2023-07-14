from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from ..models.models import Post, Tag, UserAccount, Group
from ..serializers.post_serializers import PostSerializer
from ..features.feature_functions import cut_off_hashtags, decode_token
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404

#TODO: change all the geting user object from database so it is not grabbed by any id but a JWT token
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletePost(request):
    '''
    Delete post based on sent ID of the Post object
    '''
    post = get_object_or_404(Post, id=request.data.get('id'))
    post.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retrievePost(request, pk):
    '''
    Retrieve specific post based on id
    '''
    post = get_object_or_404(Post, id=pk)
    serializer = PostSerializer(post, many=False, context={'authenticated_user': request.user})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createPost(request):
    '''
    Create new post assigned to the user
    '''
    data = request.data
    dic = cut_off_hashtags(data.get('content'))
    listOfTagObjects = []
    user = request.user
    try:
        group = Group.objects.get(id=data.get('groupId'))
    except ObjectDoesNotExist:
        group = None

    for tag in dic.get('tags'):
        try:
            instance = Tag.objects.get(name=tag)
            listOfTagObjects.append(instance)
        except ObjectDoesNotExist:
            instance = Tag.objects.create(name=tag)
            listOfTagObjects.append(instance)
    try: 
        post = Post.objects.create(
            created_by=user,
            topic="topic",
            content=dic.get('content'),
            group=group
        )
        post.tags.set(listOfTagObjects)
        post.save()
        user.number_of_posts += 1
        user.save()
        if group != None:    
            group.posts.add(post)
            group.save()
    except: 
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response({"id": post.id}, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllPostsForUser(request, offset, limit):
    '''
    Return all the posts for the authenticated user. Returned list contain posts of authenticated user,
    his friends and followers sorted from the newest to the latest based on created date
    '''
    user = request.user
    posts = Post.objects.filter(
        Q(created_by=user) |
        (Q(created_by__in=user.friends.all()) & (Q(group__participants=user) | Q(group__is_private=False) | Q(group__isnull=True)))
    ).order_by('-created_at')[offset:limit]

    if posts.exists():
        serializer = PostSerializer(posts, many=True, context={"authenticated_user": user})
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def likePost(request, user, pk):
    try:
        user = UserAccount.objects.get(pk=user)
        instance = Post.objects.get(id=pk)
        instance.liked_by.add(user)
        instance.number_of_likes = instance.number_of_likes + 1
        instance.save()
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dislikePost(request, user, pk):
    try:
        user = UserAccount.objects.get(pk=user)
        instance = Post.objects.get(id=pk)
        instance.liked_by.remove(user)
        instance.number_of_likes = instance.number_of_likes - 1
        instance.save()
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def changeIsPostFavouriteStatus(request, pk):
    '''
    Changes the state of the post (if it user favourite or not) based on the previous state (if it was favourite then it is no more)
    '''
    user = get_object_or_404(UserAccount, pk=request.user.pk)
    post = get_object_or_404(Post, pk=pk)

    if user.favouritePosts.filter(id=post.pk).exists():
        user.favouritePosts.remove(post)
        user.save()
    else:
        user.favouritePosts.add(post)
        user.save()

    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserFavouritePosts(request):
    '''
    Get all the favourite user posts
    '''
    user = request.user
    serializer = PostSerializer(user.favouritePosts, many=True, context={"authenticated_user": user})
    return Response(serializer.data, status=status.HTTP_200_OK)