# from django.db import models
# from django.contrib.auth.models import (
#     BaseUserManager, AbstractBaseUser, PermissionsMixin
# )
# from .models import Post, Answer, Group


# class MyUserManager(BaseUserManager):
#     '''
#     User Manager for Custom User Model - UserAccount
#     '''
#     def create_user(self, email, first_name, last_name, date_of_birth, password, nick_name=None, bio=None):
#         '''
#         Creates and save a User with the given email, firdst_name, second_name, nick_name, date_of_birth, bio, password
#         '''
#         if not email:
#             raise ValueError('Users must have an email address')

#         if nick_name is None or nick_name == '':
#             default_nick_name = f'@{first_name.capitalize()}{last_name.capitalize()}' # set default nickname if none was given
#             nick_name = default_nick_name
#         else:
#             nick_name = '@' + nick_name

#         user = self.model(
#             email=self.normalize_email(email),
#             first_name=first_name.capitalize(),
#             last_name=last_name.capitalize(),
#             nick_name=nick_name,
#             bio=bio,
#             date_of_birth=date_of_birth,
#         )
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
    
#     def create_superuser(self, email, first_name, last_name, date_of_birth, password, bio=None, nick_name=None):
#         '''
#         Creates and save a superuser with the given email, first_name, second_name, nick_name, date_of_birth, bio, password
#         '''
            
#         user = self.create_user(
#             email=self.normalize_email(email),
#             first_name=first_name,
#             last_name=last_name,
#             nick_name=nick_name,
#             bio=bio,
#             date_of_birth=date_of_birth,
#             password=password
#         )

#         user.is_admin = True
#         user.is_staff = True
#         user.is_superuser = True
#         user.save(using=self._db)
#         return user
    
# class UserAccount(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(
#         verbose_name='email address',
#         max_length=255,
#         unique=True
#     )
#     first_name = models.CharField(max_length=30)
#     last_name = models.CharField(max_length=30)
#     nick_name = models.CharField(max_length=60)
#     bio = models.CharField(max_length=255, null=True, blank=True)
#     date_of_birth = models.DateField()
#     avatar = models.ImageField(upload_to='uploads/% Y/% m/% d/', null=True, blank=True)
#     followers = models.ForeignKey("UserAccount", on_delete=models.CASCADE, blank=True, null=True)
#     posts = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
#     answers = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
#     groups = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True)
#     is_admin = models.BooleanField(default=False)
#     is_staff = models.BooleanField(
#         ("staff status"),
#         default=False,
#         help_text=("Designates whether the user can log into this admin site."),
#     )
#     is_active = models.BooleanField(
#         ("active"),
#         default=True,
#         help_text=(
#             "Designates whether this user should be treated as active. "
#             "Unselect this instead of deleting accounts."
#         ),
#     )

#     objects = MyUserManager()

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['first_name', 'last_name', 'date_of_birth']

#     def __str__(self):
#         return self.email
    
#     @property
#     def get_is_admin(self):
#         '''
#         Is the user admin
#         '''
#         return self.is_admin
    
#     # @is_admin.setter
#     # def is_admin(self, value):
#     #     '''
#     #     Set is_admin to given value
#     #     '''
#     #     self.i_admin = value