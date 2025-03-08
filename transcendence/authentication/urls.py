
from django.urls import path
from .views import LoginView, RegisterView, UpdateDisplayNameView, DeleteAccountView, UpdateAvatarView, UploadAvatarView, get_online_users, logout_user, add_friend
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("authentication/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # Login
    path("authentication/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # Refresh token
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('changedisplayname/', UpdateDisplayNameView.as_view(), name='changedisplayname'),
    path('deleteaccount/', DeleteAccountView.as_view(), name='deleteaccount'),
    path('update-avatar/', UpdateAvatarView.as_view(), name='update-avatar'),
    path('upload-avatar/', UploadAvatarView.as_view(), name='upload-avatar'),
    path('logout/', logout_user, name='logout'),
    path('get-onlineusers/', get_online_users, name='get-onlineusers'),
    path('add_friend/', add_friend, name='add_friend'),
]




    