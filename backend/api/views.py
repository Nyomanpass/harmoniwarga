from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Login, Pendatang
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, UserSerializer, UpdatePasswordSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer, LoginSerializer
from dashboard.serializers import PendatangSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.conf import settings
import re
import random
import string
import os


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']

    user = User.objects.get(email = email)

    #membuat token reset password
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"

    subject = "Reset Password Anda"
    message = render_to_string("account/email/password_reset_email.html",{
        "user":user,
        "reset_url":reset_url
    })
    send_mail(subject, message, "no-reply@example.com", [user.email])
    return Response({"message":"link reset password dikirim ke email anda"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    uid = serializer.validated_data["uid"]
    token = serializer.validated_data["token"]
    new_password = serializer.validated_data["new_password"]

    try:
        uid = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, TypeError):
        return Response({"error":"invalid user"}, status=status.HTTP_400_BAD_REQUEST)
    if not default_token_generator.check_token(user, token):
        return Response({"error":"invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    Login.objects.update_or_create(
        id=user.id,
        defaults={
            'password': user.password,
        }
    )

    return Response({"message":"password berhasil direset"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message':'user created successfully', 'user':serializer.data}, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        response_data = {
            'message': 'Login berhasil, selamat data di harmoniwarga',
            'access': str(access_token),
            'refresh': str(refresh),
            'role': user.role
        }

        return Response(response_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    user = request.user
    data = request.data
    nik = data.get('nik')

    if nik:
       
        if not re.fullmatch(r"^\d{16}$", nik):
            return Response({"nik": "NIK harus 16 digit dan hanya berisi angka"}, status=status.HTTP_400_BAD_REQUEST)

       
        if User.objects.filter(nik=nik).exclude(id=user.id).exists():
            return Response({"nik": "NIK sudah digunakan oleh user lain"}, status=status.HTTP_400_BAD_REQUEST)


    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        Login.objects.update_or_create(
            id=user.id,
            defaults = {
                'nik': user.nik,
                'nama_lengkap':user.nama_lengkap,
            }
        )
        return Response({"message":"Profile berhasil di perbarui"}, status=status.HTTP_200_OK)
    print(serializer.errors) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updatePassword(request):
    serializer = UpdatePasswordSerializer(data=request.data, context={'request':request})
    if serializer.is_valid():
        user = request.user
        new_password = serializer.validated_data['new_password']

        user.set_password(new_password)
        user.save()
        try:
            login = Login.objects.get(nik=user.nik)  
            login.password = user.password
            login.save()
        except Login.DoesNotExist:
            pass

        return Response({'message':'password berhasil di rubah'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_verifikasi_user(request):
    users = User.objects.filter(verifikasi=False)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_verifikasi_pendatang(request):
    pendatangs = Pendatang.objects.filter(verifikasi=False)
    serializer = PendatangSerializer(pendatangs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


def generate_password():
    characters = string.ascii_uppercase + string.digits
    password = ''.join(random.choice(characters) for _ in range(10))
    if not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
        return generate_password()
    return password

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def verifi_pendatang(request, pk):
    try:
        pendatang = Pendatang.objects.get(id=pk, verifikasi=False)
        pendatang.verifikasi = True
        pendatang.save()
        return Response({"message": "Pendatang berhasil diverifikasi."}, status=status.HTTP_200_OK)
    except Pendatang.DoesNotExist:
        return Response({"message": "Pendatang tidak ditemukan atau sudah diverifikasi."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def verifi_user(request, pk):
    try:
       
        user = User.objects.get(id=pk, verifikasi=False)
        new_password = generate_password()
        user.set_password(new_password)
        user.verifikasi = True
        user.save()

       
        send_mail(
            "Akun anda telah diverifikasi",
            f"Akun anda telah diverifikasi oleh admin.\n\nSilakan login dengan:\nNIK: {user.nik}\nPassword: {new_password}\n\nTerima kasih.",
            "info@bomboraweb.com",
            [user.email],
            fail_silently=False,
        )


        # Simpan ke TbLogin (buat baru atau update)
        Login.objects.update_or_create(
            id=user.id,  # gunakan ID unik dari TbDaftar
            defaults={
                'nik': user.nik,
                'password': user.password,
                'nama_lengkap': user.nama_lengkap,
                'role': user.role,
            }
        )

        return Response({"message": "User berhasil diverifikasi dan ditambahkan ke login."}, status=status.HTTP_200_OK)

    except Login.DoesNotExist:
        return Response({"message": "User tidak ditemukan atau sudah diverifikasi."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response({"message":"user berhasil dihapus"}, status=status.HTTP_200_OK)
    except:
        return Response({"message":"terjadi kesalaha coba lagi nanti"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_pendatang(request, pk):
    try:
        user = Pendatang.objects.get(id=pk)

        # Hapus file foto jika ada
        if user.foto and os.path.isfile(os.path.join(settings.MEDIA_ROOT, user.foto.name)):
            os.remove(os.path.join(settings.MEDIA_ROOT, user.foto.name))

        # Hapus file foto_ktp jika ada
        if user.foto_ktp and os.path.isfile(os.path.join(settings.MEDIA_ROOT, user.foto_ktp.name)):
            os.remove(os.path.join(settings.MEDIA_ROOT, user.foto_ktp.name))

        user.delete()
        return Response({"message": "Pendatang berhasil dihapus"}, status=status.HTTP_200_OK)
        
    except Pendatang.DoesNotExist:
        return Response({"message": "Pendatang tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error saat menghapus pendatang: {e}")
        return Response({"message": "Terjadi kesalahan, coba lagi nanti"}, status=status.HTTP_400_BAD_REQUEST)
