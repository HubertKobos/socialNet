from django.urls import path
from ..views.auth_views import MyTokenObtainPairView, IsTokenValid
from ..views.user_views import getUserProfile, getAllUserProfiles, registerUser, getUserProfileBasedOnUrl, editProfileData

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view()),
    path('register/', registerUser),
    path('profile/', getUserProfile),
    path('edit/', editProfileData),
    path('profile/<str:pk>/', getUserProfileBasedOnUrl),
    path('all-profiles/', getAllUserProfiles),
    path('token/verify/', IsTokenValid.as_view())
    # TODO: get followers and following
]
