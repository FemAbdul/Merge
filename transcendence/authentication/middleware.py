from django.utils.timezone import now

class UpdateOnlineStatusMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            profile = request.user.userprofile
            profile.online_status = 'online'
            profile.last_seen = now()
            profile.save()
        return self.get_response(request)
