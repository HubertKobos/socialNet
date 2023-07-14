from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models.models import Post, Tag, UserAccount

@receiver(m2m_changed, sender=Post.tags.through)
def increment_count(sender, instance, action, **kwargs):
    '''
    Increment by 1 Tag counter based on Tags from new created Post
    '''
    if action == 'post_add' and bool(kwargs['pk_set']):
        print(kwargs['pk_set'])
        tag_ids = kwargs['pk_set']
        for tag_id in tag_ids:
            try:
                tag = Tag.objects.get(id=tag_id)
            except Tag.DoesNotExist:
                raise ValueError("This Tag does not exist in the database")
            tag.number_of_posts += 1
            tag.save()

@receiver(m2m_changed, sender=Post.tags.through)
def decrement_count(sender, instance, action, **kwargs):
    '''
    Decrement by 1 Tag counter based on Tags from deleted Post
    '''
    if action == 'post_delete' and bool(kwargs['pk_set']):
        tag_ids = kwargs['pk_set']
        for tag_id in tag_ids:
            try:
                tag = Tag.objects.get(id=tag_id)
            except Tag.DoesNotExist:
                raise ValueError("This Tag does not exist in the database")
            tag.number_of_posts -= 1
            tag.save()

#TODO: create singal for counter of posts, followers and followings and also modify UserAccount model to have this variables in it