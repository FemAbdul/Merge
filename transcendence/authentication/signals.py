from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .models import UserProfile

@receiver(user_logged_in)
def set_online(sender, request, user, **kwargs):
    print(f"user_logged_in signal triggered for {user.username}.")
    user_profile = UserProfile.objects.get(user=user)
    user_profile.online_status = 'online'
    user_profile.save()

@receiver(user_logged_out)
def set_offline(sender, request, user, **kwargs):
    user_profile = UserProfile.objects.get(user=user)
    user_profile.online_status = 'offline'
    user_profile.save()
