from django.urls import path
from .views import (
    save_user_request,
    TickDataListView,
)

urlpatterns = [
    path('user_request/', save_user_request, name='user-request'),
    path('fetch_market_data/', TickDataListView.as_view(), name='fetch-market-data'),
]
