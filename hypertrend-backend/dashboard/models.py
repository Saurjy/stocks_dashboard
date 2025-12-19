from django.db import models
from django.utils import timezone

class UserRequests(models.Model):

    request_id = models.AutoField(primary_key=True)
    symbol = models.CharField(max_length=20, help_text="Store the Symbol of the Company To Search")
    company = models.CharField(max_length=300, help_text="Store the Name of the Company To Search")
    stock_held = models.IntegerField(default=0, help_text="Store the Number of Stocks held of that Company by and Individual")
    dated_on = models.DateTimeField(default=timezone.now, help_text="Store the Date When the Stock was Bought")
    added_on = models.DateTimeField(default=timezone.now, help_text="Store the Date When the Entry was Created")
    investment_value = models.DecimalField(max_digits=20, decimal_places=2, help_text="Store the Initial Investment Value for the Stock")

    class Meta:
        db_table = 'user_requests'