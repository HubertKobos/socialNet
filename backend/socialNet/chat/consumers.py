import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from datetime import datetime
import redis

# both users log into the same conversation based on URL id_conversation
# then both of the users has to be authenticated via jwt and if their ids are in the instance of conversation 

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.disconnect()
        else:
            self.room_name = self.scope["url_route"]["kwargs"]["conversation_id"]
            self.room_group_name = "chat_%s" % self.room_name

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name, self.channel_name
            )
            self.redis = redis.Redis(host='localhost', port=6379, db=0)
            

            await self.accept()        

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        message = text_data_json.get("message")

        # get_last_20_messages is an action that happens that means to get last 20 messages from database so the client chat can render this out
        if action == 'get_last_20_messages':
            # get 20 last messages from redis database
            last_20_messages = self.redis.lrange(f"conversation:{self.room_name}", -20, -1)

            last_20_messages_dict = {}
            for index, message in enumerate(last_20_messages):
                last_20_messages_dict[index] = message.decode('utf-8')

            await self.send(json.dumps({"last_20_messages": last_20_messages_dict})) # send last 20 messages after connection is open

        if action == None:
            id = text_data_json['owner']
            
            # timestamp = json.dumps(datetime.now(), indent=4, sort_keys=True, default=str)
            timestamp = datetime.now().isoformat()
            
            conversation_key = f"conversation:{self.room_name}"
            self.redis.rpush(conversation_key, json.dumps({"owner": id, "message": message, "timestamp": timestamp}))
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat_message","owner": id, "message": message, 'timestamp': timestamp}
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        id = event["owner"]

        # # Send message to WebSocket
        await self.send(text_data=json.dumps({"owner": id, "message": message, 'timestamp': json.dumps(datetime.now(), indent=4, sort_keys=True, default=str)}))

