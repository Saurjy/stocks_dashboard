from rest_framework import serializers
from .models import UserRequests

class UserRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRequests
        fields = '__all__'