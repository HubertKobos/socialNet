from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
import environ
import jwt
import boto3

env = environ.Env()
environ.Env.read_env()

def cut_off_hashtags(content):
    '''
    From the given content cut off tags which are characterized by `#` sign.
    For example for the given content: `This is my post #post #tag` returned value is dictionary 
    {content: This is my post, tags: post, tag}
    '''
    hashtags= []
    result_content = ''
    for word in content.split():
        if word.startswith('#'):
            hashtags.append(word[1:])
        else:
            result_content += str(word) + ' '
    content = result_content[:-1]
    return {'content': content, 'tags': hashtags }
    
def decode_token(request):
    '''
    Decode JWT token from request object
    '''
    authorization_header = get_authorization_header(request)
    if not authorization_header:
        raise AuthenticationFailed('Authentication header missing')
    
    try:
        token = authorization_header.decode('utf-8').split(' ')[1] # grab the token from `Bearer token` string
        payload = jwt.decode(token, env('SECRET_KEY'), algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Tokeh has expired')
    except IndexError:
        raise AuthenticationFailed('Token not found in header')
    except Exception as e:
        raise AuthenticationFailed(str(e))
    
def get_avatar_link(avatar_key):
    '''
    Return URL to user avatar from AWS S3 Bucket
    '''
    s3 = boto3.client('s3',
                      aws_access_key_id=env('AWS_ACCESS_KEY_ID'), 
                      aws_secret_access_key=env('AWS_SECRET_ACCESS_KEY'),
                      region_name=env('AWS_S3_REGION_NAME'))
    url = s3.generate_presigned_url(
        'get_object', 
        Params={'Bucket': env('AWS_STORAGE_BUCKET_NAME'), 'Key': str(avatar_key)}
    )
    return url