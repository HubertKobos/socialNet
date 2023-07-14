from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers.auth_serializers import MyTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import AuthenticationFailed, TokenError
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework import status

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class IsTokenValid(APIView):
    def post(self, request):
        token = request.data.get('token', None)
        if token is None:
            return Response({'error': 'Token is not provided.'}, status=400)

        try:
            AccessToken(token)  # This will raise an exception if the token is not valid.
            return Response({'success': 'Token is valid.'}, status=status.HTTP_200_OK)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)