from django.urls import path
from ..views.answer_views import likeAnswer, dislikeAnswer

urlpatterns = [
    path('<str:pk>/like', likeAnswer),
    path('<str:pk>/dislike', dislikeAnswer),
    
]
