# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from rest_framework import status

# from .serializers import Userserializer

# @api_view(['POST'])
# @permission_classes([AllowAny])

# def registration(request):
#     serializer = Userserializer(deta=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(
#             {"message":'user cerated successfully..'},
#             status=status.HTTP_201_CREATED
#         )
#     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST,HTTP_404_NOT_FOUND,HTTP_200_OK
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    form = UserCreationForm(request.data)

    if form.is_valid():
        form.save()
        return Response({"message": "Account created successfully"}, status=HTTP_201_CREATED)

    return Response(form.errors, status=HTTP_400_BAD_REQUEST)



@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'username':user.username ,'token': token.key},status=HTTP_200_OK)
