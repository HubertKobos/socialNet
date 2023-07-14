
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models.models import UserAccount, FriendRequest, GroupRequest
import json
from channels.db import database_sync_to_async

@database_sync_to_async
def check_friend_requests(user: UserAccount):
    friend_requests = FriendRequest.objects.filter(request_to=user.id)
    for obj in friend_requests:
        print(obj.request_from)
    return list(friend_requests)

@database_sync_to_async
def check_group_requests(user: UserAccount):
    group_requests = GroupRequest.objects.filter(request_to=user.id)
    for obj in group_requests:
        print(obj.request_from)
    return list(group_requests)

class NotificationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close(1001)
        else:
            group_requests = await check_group_requests(user=user)
            friend_requests = await check_friend_requests(user=user)
            
            self.group_name = f'notifications_group_{user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()

            if group_requests or friend_requests:
                await self.send_notifaction_on_connect(friend_requests, group_requests)

    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user = self.scope['user']
        text_data_json['from_user_id'] = str(user.id)
        text_data_json['from_user_first_name'] = str(user.first_name)
        text_data_json['from_user_last_name'] = str(user.last_name)
        text_data_json['from_user_avatar'] = str(user.avatar)
        to_user_id = text_data_json.get("to_user_id")
        request_type = text_data_json.get('type')
        
        # Send message to room group
        await self.channel_layer.group_send(
            f"notifications_group_{to_user_id}", {"type": "send_notification", "data": text_data_json}
        )
        

    async def send_notifaction_on_connect(self, friend_requests, group_requests):
        '''
        Execute this function after connection is accepted to receive all the friend and group requests user received when was offline or unread yet
        '''
        group_notification_message = {}
        notification_message = {}
        if friend_requests != []:
            notification_message['friend_requests_notifications'] = [{"id": str(obj.request_from.id), "first_name": str(obj.request_from.first_name), "last_name": str(obj.request_from.last_name), "avatar": str(obj.request_from.avatar), "request_type": "friend_request"} for obj in friend_requests]
        if group_requests != []:
            group_notification_message['group_requests_notifications'] = [{"id": str(obj.request_from.id), "first_name": obj.request_from.first_name, "last_name": obj.request_from.last_name, "avatar": str(obj.request_from.avatar), "request_type": "group_request"} for obj in group_requests]

        merged_notifications = notification_message | group_notification_message
        await self.send(json.dumps(merged_notifications))

    async def send_notification(self, text_data):
        '''
        Send notification when the user is connected 
        '''
        notification_message = {}
        data = text_data.get('data')
        request_type = data.get("type")
        if request_type == "friend_request":
            notification_message['friend_requests_notifications'] = [{"id": str(data.get("from_user_id")), "first_name": str(data.get("from_user_first_name")), "last_name": str(data.get("from_user_last_name")), "avatar": str(data.get("from_user_avatar")), "request_type": "friend_request"}]
        await self.send(json.dumps(notification_message))