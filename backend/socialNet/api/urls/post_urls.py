from django.urls import path
from ..views.post_views import deletePost, createPost, getAllPostsForUser, likePost, dislikePost, retrievePost, changeIsPostFavouriteStatus, getUserFavouritePosts
from ..views.answer_views import createAnswer, getAllAnswersForPost

urlpatterns = [
    path('create/', createPost),
    path('delete/', deletePost),
    path('get/<str:pk>', retrievePost),
    path('user-posts/<int:offset>/<int:limit>/', getAllPostsForUser),
    path('answer/create', createAnswer), # create answer for the post with given pk
    path('<str:pk>/answers/<int:offset>/<int:limit>/', getAllAnswersForPost),
    path('<str:user>/likes/<str:pk>', likePost),
    path('<str:user>/dislikes/<str:pk>', dislikePost),
    path('change-favourite-status/<str:pk>', changeIsPostFavouriteStatus),
    path("favourite-posts/", getUserFavouritePosts),
]
