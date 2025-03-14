from django.db import models
from django.contrib.auth.models import User
import pyotp

# Create your models here.

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     display_name = models.CharField(max_length=50)
#     avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
#     online_status = models.CharField(
#         max_length=10,
#         choices=[('online', 'Online'), ('offline', 'Offline')],
#         default='offline'
#     )
#     last_seen = models.DateTimeField(null=True, blank=True)

#     def __str__(self):
#         return f"{self.user.username}'s Profile"

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
    two_factor_secret = models.CharField(max_length=32, null=True, blank=True)  # 2FA secret key

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def generate_2fa_secret(self):
        """Generate and return a new 2FA secret key."""
        secret = pyotp.random_base32()
        self.two_factor_secret = secret
        self.save()
        return secret

    def get_otp_uri(self):
        """Generate a QR code URL for Google Authenticator."""
        if not self.two_factor_secret:
            self.generate_2fa_secret()
        return pyotp.totp.TOTP(self.two_factor_secret).provisioning_uri(
            self.user.username, issuer_name="YourAppName"
        )

    def verify_otp(self, otp_code):
        """Verify the provided 2FA OTP code."""
        if not self.two_factor_secret:
            return False
        totp = pyotp.TOTP(self.two_factor_secret)
        return totp.verify(otp_code)

class Friendship(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_of')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')  # Ensure no duplicate friendships

    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username}"