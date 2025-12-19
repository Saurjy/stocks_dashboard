from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserRequestSerializer

@api_view(['POST'])
def save_user_request(request):
    serializer = UserRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)