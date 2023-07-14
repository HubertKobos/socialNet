from django.conf import settings
from django.db import models
import uuid
# from django.contrib.auth import get_user_model

# User = get_user_model()
from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)

from django_countries.fields import CountryField

class MyUserManager(BaseUserManager):
    '''
    User Manager for Custom User Model - UserAccount
    '''
    def create_user(self, email, first_name, last_name, date_of_birth, password, nick_name=None, bio=None):
        '''
        Creates and save a User with the given email, firdst_name, second_name, nick_name, date_of_birth, bio, password
        '''
        if not email:
            raise ValueError('Users must have an email address')

        if nick_name is None or nick_name == '':
            default_nick_name = f'@{first_name.capitalize()}{last_name.capitalize()}' # set default nickname if none was given
            nick_name = default_nick_name
        else:
            nick_name = '@' + nick_name

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name.capitalize(),
            last_name=last_name.capitalize(),
            nick_name=nick_name,
            bio=bio,
            date_of_birth=date_of_birth,
        )
        user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, first_name, last_name, date_of_birth, password, bio=None, nick_name=None):
        '''
        Creates and save a superuser with the given email, first_name, second_name, nick_name, date_of_birth, bio, password
        '''
            
        user = self.create_user(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            nick_name=nick_name,
            bio=bio,
            date_of_birth=date_of_birth,
            password=password
        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True
    )
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    nick_name = models.CharField(max_length=60)
    bio = models.CharField(max_length=255, null=True, blank=True)
    date_of_birth = models.DateField()
    city = models.CharField(max_length=30, null=True, blank=True)
    country = CountryField(null=True, blank=True)
    avatar = models.ImageField(null=True, blank=True, default=settings.DEFAULT_AVATAR_PATH)
    # followers = models.ManyToManyField("UserAccount", related_name="Followers", null=True, blank=True)
    # following = models.ManyToManyField("UserAccount", null=True, blank=True)
    number_of_posts = models.IntegerField(default=0) # storing number, instead of counting all the posts, so it's more efficient
    answers = models.ManyToManyField("Answer", null=True, blank=True)
    groups = models.ManyToManyField("Group", null=True, blank=True)
    friends = models.ManyToManyField("UserAccount", related_name="Friends", null=True, blank=True)
    favouritePosts = models.ManyToManyField("Post", null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(
        ("staff status"),
        default=False,
        help_text=("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        ("active"),
        default=True,
        help_text=(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'date_of_birth']

    def __str__(self):
        return self.email
    
    @property
    def get_is_admin(self):
        '''
        Is the user admin
        '''
        return self.is_admin


class Post(models.Model):
    '''
    Post model which contains its content and all the users answers for itself
    '''
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(UserAccount, on_delete=models.CASCADE, null=False, blank=False, related_name="postCreatedBy") # one post has only one owner
    created_at = models.DateTimeField(auto_now_add=True)
    topic = models.CharField(max_length=50)
    content = models.CharField(max_length=255)
    tags = models.ManyToManyField("Tag")
    group = models.ForeignKey("Group", on_delete=models.CASCADE, null=True, blank=True, related_name="postGroup")
    # answers = models.ForeignKey("Answer", on_delete=models.CASCADE, null=True, blank=True, related_name="postAnswers")
    answers = models.ManyToManyField("Answer", related_name="PostAnswers")
    number_of_answers = models.IntegerField(default=0)
    liked_by = models.ManyToManyField("UserAccount")
    number_of_likes = models.IntegerField(default=0) # storing likes so it might be more efficient with bigh amount of users

    def __str__(self):
        return f'{self.topic}'

class Answer(models.Model):
    '''
    Answer to post, can be edited only once
    '''
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(UserAccount, on_delete=models.CASCADE, null=False, blank=False, related_name="answerCreatedBy")
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True) 
    is_edited = models.BooleanField(default=False) # was answer edited
    original_content = models.CharField(max_length=255, blank=False, null=False)
    edited_content = models.CharField(max_length=255, blank=True) # content after edit of original_content
    post = models.ForeignKey("Post", on_delete=models.CASCADE, blank=True, null=True)
    group = models.ForeignKey("Group", on_delete=models.CASCADE, blank=True, null=True)
    liked_by = models.ManyToManyField("UserAccount")
    number_of_likes = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.created_by}'

class Tag(models.Model):
    '''
    Tag for posts, tags has number_of_posts variable that is increased by sender every time Post object related to tag is created
    '''
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30)
    number_of_posts = models.IntegerField(default=0, editable=False) # increase by 1 everytime new post is created under specific tag

    def __str__(self):
        return f'{self.name}'

class Group(models.Model):
    '''
    Users can create groups 
    '''
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    participants = models.ManyToManyField(UserAccount, related_name='participants')
    posts = models.ManyToManyField("Post", related_name="groupsPosts")
    is_private = models.BooleanField(null=False, blank=False, default=False)

    def __str__(self):
        return f'{self.name}'

# create group invitation

class BaseRequest(models.Model):
    '''
    Base Class for requests Models
    '''
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_from = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='%(class)s_request_from')
    request_to = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='%(class)s_request_to')
    status=models.CharField(max_length=264,null=True,blank=True,default="unread")

    class Meta:
        abstract = True # creates seperate tables for kids (turn off mutliple-table inheritance)

    # def __str__(self):
    #     return f'from {self.request_from} to {self.request_to}'

    # can't do request_from or request_to due the asynchronoous call from consumer which will raise error
    def __str__(self):
        return f"{self.id}"

class GroupRequest(BaseRequest):
    '''
    Invitation to the group
    '''
    pass

class FriendRequest(BaseRequest):
    '''
    Invitation to the friend list
    '''
    pass

# class Notifications(models.Model):
#     user_sender=models.ForeignKey(UserAccount,null=True,blank=True,related_name='user_sender',on_delete=models.CASCADE)
#     user_revoker=models.ForeignKey(UserAccount,null=True,blank=True,related_name='user_revoker',on_delete=models.CASCADE)
#     status=models.CharField(max_length=264,null=True,blank=True,default="unread")
#     type_of_notification=models.CharField(max_length=264,null=True,blank=True)