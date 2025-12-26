from rest_framework import serializers
from .models import UserRequests,TickData

class UserRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRequests
        fields = '__all__'

class TickDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TickData
        fields = '__all__'