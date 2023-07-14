from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from ..models import Post, Answer, UserAccount
from ..serializers.answer_serializers import AnswersSerializer
from django.shortcuts import get_object_or_404

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createAnswer(request):
    '''
    Create answer for post of given id
    '''
    data = request.data
    created_by_user_instance = get_object_or_404(UserAccount, id=data.get("created_by"))
    post_instance = get_object_or_404(Post, id=data.get('post'))
    try:
        answer_instance = Answer.objects.create(
            created_by=created_by_user_instance, 
            original_content=data.get('original_content'),
            post=post_instance
        )
        post_instance.number_of_answers = post_instance.number_of_answers + 1
        post_instance.answers.add(answer_instance)
        post_instance.save()
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Something went wrong")
    return Response({"id": answer_instance.id}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllAnswersForPost(request, pk, offset, limit):
    '''
    Return all the answers for specific post based on given pk in URL
    '''
    num_of_answers_to_return = limit-offset
    instance = get_object_or_404(Post, id=pk)
    answers = instance.answers.order_by('-created_at')[offset:limit]
    if len(answers) == num_of_answers_to_return:
        serializer = AnswersSerializer(answers, many=True, context={'authenticated_user': request.user})
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif len(answers) < num_of_answers_to_return and answers.exists():
        serializer = AnswersSerializer(answers, many=True, context={'authenticated_user': request.user})
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif not answers.exists():
        return Response([], status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def likeAnswer(request, pk):
    user = request.user
    answer = get_object_or_404(Answer, id=pk)
    if user in answer.liked_by.all():
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Already liked")
    answer.liked_by.add(user)
    answer.number_of_likes += 1
    answer.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dislikeAnswer(request, pk):
    user = request.user
    answer = get_object_or_404(Answer, id=pk)
    if user not in answer.liked_by.all():
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Already disliked")
    answer.liked_by.remove(user)
    answer.number_of_likes -= 1
    answer.save()
    return Response(status=status.HTTP_200_OK)