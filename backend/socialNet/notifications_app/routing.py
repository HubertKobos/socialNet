from django.urls import path
from .Consumers.consumers import NotificationsConsumer

websocket_urlpatterns = [
    path('ws/', NotificationsConsumer.as_asgi()),

]