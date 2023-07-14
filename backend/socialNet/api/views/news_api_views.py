from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from newsapi import NewsApiClient
import environ

env = environ.Env()
environ.Env.read_env()

# Init
newsapi = NewsApiClient(api_key=env('NEWS_API_KEY'))

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getNews(request):
    '''
    Retrieve all the news from US from newsapi.org
    '''
    try: 
        # get news from Poland
        data = newsapi.get_top_headlines(country='us', page_size=10)
        del data['totalResults']
        del data['status']
        for item in data['articles']:
            item.pop('author', None)
            item.pop('description', None)
            item.pop('publishedAt', None)
            item.pop('content', None)
            item.pop('source', None)

    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(data, status=status.HTTP_200_OK)