from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED, 
    HTTP_400_BAD_REQUEST, 
    HTTP_404_NOT_FOUND, 
    HTTP_200_OK
)

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils.timezone import now

from .models import WeightEntry
from .serializers import WeightEntrySerializer


#                 USER AUTH

@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    form = UserCreationForm(request.data)
    if form.is_valid():
        user = form.save()
        Token.objects.create(user=user)
        return Response({"message": "Account created successfully"}, status=HTTP_201_CREATED)
    return Response(form.errors, status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({'username': user.username, 'token': token.key}, status=HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"}, status=HTTP_200_OK)
    except:
        return Response({"error": "Logout failed"}, status=HTTP_400_BAD_REQUEST)



#           WEIGHT TRACKING CORE

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_weight(request):
    today = now().date()

    # 1 weight per day rule
    if WeightEntry.objects.filter(user=request.user, date=today).exists():
        return Response(
            {"error": "You have already added your weight for today."},
            status=HTTP_400_BAD_REQUEST
        )

    serializer = WeightEntrySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=HTTP_201_CREATED)

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_weight(request):
    weights = WeightEntry.objects.filter(user=request.user).order_by('-date')
    serializer = WeightEntrySerializer(weights, many=True)
    return Response(serializer.data, status=HTTP_200_OK)



#                CRUD OPERATIONS

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_weight(request, pk):
    try:
        weight = WeightEntry.objects.get(id=pk, user=request.user)
    except WeightEntry.DoesNotExist:
        return Response({"error": "Weight entry not found"}, status=HTTP_404_NOT_FOUND)

    serializer = WeightEntrySerializer(weight)
    return Response(serializer.data, status=HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_weight(request, pk):
    try:
        weight = WeightEntry.objects.get(id=pk, user=request.user)
    except WeightEntry.DoesNotExist:
        return Response({"error": "Weight entry not found"}, status=HTTP_404_NOT_FOUND)

    serializer = WeightEntrySerializer(weight, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_200_OK)

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_weight(request, pk):
    try:
        weight = WeightEntry.objects.get(id=pk, user=request.user)
    except WeightEntry.DoesNotExist:
        return Response({"error": "Weight entry not found"}, status=HTTP_404_NOT_FOUND)

    weight.delete()
    return Response({"message": "Weight entry deleted successfully"}, status=HTTP_200_OK)



#       WEIGHT LOSS BETWEEN TWO DATES API


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def weight_difference_api(request):
    date1 = request.data.get("date1")
    date2 = request.data.get("date2")

    # Check for missing dates
    if not date1 or not date2:
        return Response(
            {"error": "Please provide 'date1' and 'date2' in YYYY-MM-DD format."},
            status=HTTP_400_BAD_REQUEST
        )

    # Fetch entries
    entry1 = WeightEntry.objects.filter(user=request.user, date=date1).first()
    entry2 = WeightEntry.objects.filter(user=request.user, date=date2).first()

    if not entry1 or not entry2:
        return Response(
            {"error": "No weight entry found for one or both dates."},
            status=HTTP_404_NOT_FOUND
        )

    # Calculate difference
    difference = entry2.weight - entry1.weight

    # Build message
    if difference > 0:
        msg = f"You gained {difference} kg from {date1} to {date2}."
    elif difference < 0:
        msg = f"You lost {-difference} kg from {date1} to {date2}."
    else:
        msg = f"Your weight remained the same ({entry1.weight} kg) on both dates."

    return Response({
        "date1": date1,
        "date2": date2,
        "weight1": entry1.weight,
        "weight2": entry2.weight,
        "difference": difference,
        "message": msg
    }, status=HTTP_200_OK)
