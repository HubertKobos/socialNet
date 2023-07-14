"""
ASGI config for socialNet project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from notifications_app.routing import websocket_urlpatterns as notifications_urls
from chat.routing import websocket_urlpatterns as chat_urls
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialNet.settings')

django_asgi_app = get_asgi_application()

import chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddlewareStack(URLRouter([
                path("notifications/", URLRouter(notifications_urls)),
                path("chat/", URLRouter(chat_urls))
            ])
        ),
})

# application = ProtocolTypeRouter({
#     "http": django_asgi_app,
#     "websocket": AllowedHostsOriginValidator(
#             AuthMiddlewareStack(URLRouter([
#                 path("stories/notification_testing/", NotificationConsumer.as_asgi()),
#             ]))
#         ),
# })
