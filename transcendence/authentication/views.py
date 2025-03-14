from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile, Friendship
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.http import HttpRequest
from django.db.models import Q
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
import json
import os
import shutil
from django.conf import settings
import pyotp
import qrcode
import io
from django.http import HttpResponse
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken


def get_avatar_url(user, request: HttpRequest):
 
        avatar_name = user.userprofile.avatar.name if getattr(user.userprofile.avatar, 'name', None) else 'images/avatar.png'
        avatar_url = user.userprofile.avatar.url if getattr(user.userprofile.avatar, 'url', None) else 'images/avatar.png'
    
    # if avatar_url:  # Case 1: User has an uploaded avatar
        if avatar_name.startswith('/media/'):  # Uploaded file from MEDIA_URL
            return request.build_absolute_uri(avatar_name)
        else:  # Case 2: Selected avatar (pre-defined from database)
            return avatar_name

# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(request, username=username, password=password)

#         if user is not None:
#             # Authentication successful so generate JWT token
#             refresh = RefreshToken.for_user(user)
#             avatar_name = get_avatar_url(user, request)

#             login(request, user) # Automatically triggers set_online signal

#             return Response({"message": "Login successful","username": user.username,
#                 "display_name": user.userprofile.display_name,
#                 "avatar": avatar_name,
#                 "refresh": str(refresh),
#                 "access": str(refresh.access_token), }, status=status.HTTP_200_OK)
#         else:
#             # Authentication failed
#             return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            user_profile = UserProfile.objects.get(user=user)

            # If 2FA is enabled, request OTP verification
            if user_profile.two_factor_secret:
                return Response(
                    {
                        "message": "OTP required for 2FA users",
                        "2fa_required": True,
                        "username": user.username,
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            # No 2FA required – log in directly
            refresh = RefreshToken.for_user(user)
            avatar_name = get_avatar_url(user, request)

            login(request, user)  # Set online status

            return Response(
                {
                    "message": "Login successful",
                    "username": user.username,
                    "display_name": user_profile.display_name,
                    "avatar": avatar_name,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST,
        )

class Verify2FAView(APIView):
    def post(self, request):
        username = request.data.get("username")
        otp_code = request.data.get("otp_code")

        try:
            user = User.objects.get(username=username)
            user_profile = user.userprofile

            # Ensure 2FA is enabled for this user
            if not user_profile.two_factor_secret:
                return Response(
                    {"error": "2FA not enabled for this user"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Verify OTP code
            totp = pyotp.TOTP(user_profile.two_factor_secret)
            if not totp.verify(otp_code):
                return Response(
                    {"error": "Invalid OTP code"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # OTP is valid – log the user in and return their details
            refresh = RefreshToken.for_user(user)
            avatar_name = get_avatar_url(user, request)

            login(request, user)  # Set online status

            return Response(
                {
                    "message": "2FA verified successfully",
                    "username": user.username,
                    "display_name": user_profile.display_name,
                    "avatar": avatar_name,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

class Generate2FAQRView(APIView):
    permission_classes = [IsAuthenticated]  # Only allow logged-in users

    def get(self, request):
        user_profile = request.user.userprofile  # Get the user's profile

        # Generate secret key if not already set
        if not user_profile.two_factor_secret:
            user_profile.generate_2fa_secret()

        # Generate OTP URI
        otp_uri = user_profile.get_otp_uri()

        # Create QR Code
        qr = qrcode.make(otp_uri)
        img_io = io.BytesIO()
        qr.save(img_io, format='PNG')
        img_io.seek(0)

        return HttpResponse(img_io, content_type="image/png")

class OTPVerificationFor2FAView(APIView):
    permission_classes = [IsAuthenticated]  # Only allow logged-in users
    def post(self, request):
        username = request.data.get("username")
        otp_code = request.data.get("otp_code")

        # Ensure both username and OTP are provided
        if not username or not otp_code:
            return Response(
                {"error": "Username and OTP code are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username)
            user_profile = user.userprofile

            # Check if the user has started 2FA setup (i.e., the secret key exists)
            if not user_profile.two_factor_secret:
                return Response(
                    {"error": "2FA setup has not been started for this user"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Use the model method to verify OTP
            if not user_profile.verify_otp(otp_code):
                return Response(
                    {"error": "Invalid OTP code"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # OTP is valid – proceed with enabling 2FA
            # No need to set 'two_factor_enabled' field as you don't have it

            return Response(
                {
                    "message": "2FA has been successfully enabled.",
                    "username": user.username,
                    "display_name": user_profile.display_name,
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

class RegisterView(APIView):
    def post(self, request):
        print("Register view hit!") 
        username = request.data.get('username')
        display_name = request.data.get('display_name')
        password = request.data.get('password')
        email = request.data.get('email')
        avatar = 'images/avatar.png'
        # Check for required fields
        if not username or not display_name or not password or not email:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Username and email uniqueness check
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
       
        # Create a new user
        user = User.objects.create_user(username=username, password=password, email=email)
         # Create profile with display name and optional avatar , avatar=avatar
        UserProfile.objects.create(user=user, display_name=display_name, avatar=avatar)

        user.save()

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

class UpdateDisplayNameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_display_name = request.data.get('display_name')

        if not new_display_name or len(new_display_name) > 20:
            return Response({"error": "Invalid display name. Must be 1-20 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.display_name = new_display_name
        user_profile.save()

        return Response({"message": "Display name updated successfully", "display_name": user_profile.display_name}, status=status.HTTP_200_OK)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user

        # Deleting the user and associated profile
        # Check if there's a folder for the user avatar (assuming it's stored by user ID)
        avatar_folder_path = os.path.join(settings.MEDIA_ROOT, 'avatars', str(user.id))

        # If the folder exists, delete it and its contents
        if os.path.exists(avatar_folder_path):
            shutil.rmtree(avatar_folder_path)  # This removes the folder and its contents

        user.delete()

        return Response({"message": "Account deleted successfully."}, status=status.HTTP_200_OK)

class UpdateAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        avatar = request.data.get('avatar')
        if not avatar:
            return Response({'error': 'Invalid avatar path'}, status=400)

        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.avatar = avatar
        user_profile.save()
        avatar_name = get_avatar_url(request.user, request)
        return Response({'avatar_url': avatar_name}, status=200)

class UploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('avatar')
        if not file:
            return Response({'error': 'No file uploaded'}, status=400)

        # Save the file
        file_path = default_storage.save(f'avatars/{request.user.id}/{file.name}', file)
        avatar_url = default_storage.url(file_path)
        
        # Update user profile
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.avatar = avatar_url
        user_profile.save()
        avatar_name = get_avatar_url(request.user, request)
        return Response({'avatar_url': avatar_name}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)  # Automatically triggers set_offline signal
    return JsonResponse({'message': 'Logout successful'}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_online_users(request):
    user = request.user

    print("Request User:", request.user)
    print(f"User: {user}, Is Authenticated: {user.is_authenticated}")

    # Get all online users
    online_users = User.objects.filter(userprofile__online_status='online').exclude(id=user.id)

    # Get all friends of the logged-in user
    friends = Friendship.objects.filter(user=user).select_related('friend')
    friends_ids = {f.friend.id for f in friends}

    # Build the user list
    users = []
    for online_user in online_users:
        users.append({
            'id': online_user.id,
            'display_name': online_user.userprofile.display_name,
            'online_status': 'online',
            'is_friend': online_user.id in friends_ids
        })

    for friend in friends:
        if friend.friend.id not in {u['id'] for u in users}:  # Add offline friends
            users.append({
                'id': friend.friend.id,
                'display_name': friend.friend.userprofile.display_name,
                'online_status': friend.friend.userprofile.online_status,
                'is_friend': True
            })

    return JsonResponse({'users': users})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_friend(request):
        if request.method == 'POST':
            user = request.user
            try:
                body = json.loads(request.body)  # Parse JSON body
                friend_id = body.get('friend_id')  # Extract friend_id
                if not friend_id:
                    return JsonResponse({'error': 'Friend ID not provided'}, status=400)
                print("Friend id:",friend_id)
                friend = User.objects.get(id=friend_id)  # Check if user exists
                if Friendship.objects.filter(user=user, friend=friend).exists():
                    return JsonResponse({'message': 'Already friends!'}, status=400)

                # Create friendships
                Friendship.objects.create(user=user, friend=friend)
                Friendship.objects.create(user=friend, friend=user)
                return JsonResponse({'message': f'You are now friends with {friend.username}!'}, status=200)

            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        return JsonResponse({'error': 'Invalid request method'}, status=405)