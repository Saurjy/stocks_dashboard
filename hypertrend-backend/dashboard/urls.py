from django.urls import path
from .views import (
    save_user_request,
)

urlpatterns = [
    path('user_request/', save_user_request, name='user-request'),
]
