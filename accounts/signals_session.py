from django.contrib.auth.signals import (
    user_logged_in,
    user_logged_out,
)
from django.dispatch import receiver
from django.utils import timezone

from .models import UserSession


@receiver(user_logged_in)
def create_user_session(sender, request, user, **kwargs):

    UserSession.objects.update_or_create(
        session_key=request.session.session_key,
        defaults={
            "user": user,
            "ip_address": get_client_ip(request),
            "user_agent": request.META.get(
                "HTTP_USER_AGENT",
                ""
            ),
            "is_active": True,
            "logout_time": None,
        },
    )


@receiver(user_logged_out)
def close_user_session(sender, request, user, **kwargs):

    if request is None:
        return

    UserSession.objects.filter(
        session_key=request.session.session_key
    ).update(
        is_active=False,
        logout_time=timezone.now(),
    )


def get_client_ip(request):

    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")

    if forwarded:
        return forwarded.split(",")[0]

    return request.META.get("REMOTE_ADDR")