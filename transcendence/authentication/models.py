from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    online_status = models.CharField(
        max_length=10,
        choices=[('online', 'Online'), ('offline', 'Offline')],
        default='offline'
    )
    last_seen = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Friendship(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_of')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')  # Ensure no duplicate friendships

    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username}"