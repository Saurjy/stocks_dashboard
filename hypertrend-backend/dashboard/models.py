from django.db import models
from django.utils import timezone
from decimal import Decimal

class UserRequests(models.Model):

    request_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(default=0, help_text="Store the User ID of the Company To Search")
    symbol = models.CharField(max_length=20, help_text="Store the Symbol of the Company To Search")
    company = models.CharField(max_length=300, help_text="Store the Name of the Company To Search")
    stock_held = models.IntegerField(help_text="Store the Number of Stocks held of that Company by and Individual")
    dated_on = models.DateTimeField(help_text="Store the Date When the Stock was Bought")
    added_on = models.DateTimeField(default=timezone.now, help_text="Store the Date When the Entry was Created")
    is_added = models.BooleanField(default=False, help_text="Store the Value if Request was Completed")
    is_checked = models.BooleanField(default=False, help_text="Store the Value if Company was Initialized")
    investment_value = models.DecimalField(max_digits=20, decimal_places=2, help_text="Store the Initial Investment Value for the Stock")
    mystocks = models.BooleanField(default=False, help_text="Store the status for the Stock")

    class Meta:
        db_table = 'user_requests'

from django.db import models

class TickData(models.Model):
    
    time = models.DateTimeField()
    symbol = models.CharField(primary_key=True, unique=False, max_length=32)

    open = models.DecimalField(max_digits=15, decimal_places=2)
    high = models.DecimalField(max_digits=15, decimal_places=2)
    low  = models.DecimalField(max_digits=15, decimal_places=2)
    close = models.DecimalField(max_digits=15, decimal_places=2)

    volume = models.BigIntegerField()
    exchange = models.CharField(max_length=10)

    class Meta:
        db_table = "tick_data"
        managed = False
        indexes = [
            models.Index(fields=["symbol", "time"]),
        ]
