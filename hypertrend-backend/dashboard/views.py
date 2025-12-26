from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.filters import OrderingFilter

from .serializers import UserRequestSerializer, TickDataSerializer, TickData

@api_view(['POST'])
def save_user_request(request):
    serializer = UserRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

class TickDataListView(ListAPIView):
    queryset = TickData.objects.all()
    serializer_class = TickDataSerializer

    def get_queryset(self):
        return (
            TickData.objects
            .order_by("symbol", "-time")
            .distinct("symbol")
        )
