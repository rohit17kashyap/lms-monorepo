from django.utils import timezone

from .models import UserSession


class UserActivityMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        response = self.get_response(request)

        if (
            request.user.is_authenticated
            and request.session.session_key
        ):
            UserSession.objects.filter(
                session_key=request.session.session_key,
                is_active=True,
            ).update(
                last_activity=timezone.now()
            )

        return response