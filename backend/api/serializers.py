import random
import string
from django.core.mail import send_mail
from rest_framework import serializers
from .models import User, Login
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        "pastikan email terdaftar"
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("email tidak terdaftar")
        
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only = True, min_length=6)

    def validate_new_password(self, value):
        "pastika passwod valid"
        if len(value) < 6:
            raise serializers.ValidationError("password harus minimal 6 karakter")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("password harus mengandung setidaknya satu huruf besar")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("password harus mengandung setidakknya satu angka")
        return value

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.verifikasi:
            raise serializers.ValidationError({"verified":"akun anda belum diverifikasi oleh admin"})
        data['email'] = self.user.email
        data['role'] = self.user.role
        return data

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nik', 'nama_lengkap', 'alamat', 'phone', 'email', 'role']
        extra_kwargs = {
            'nik': {
                'error_messages': {
                    'blank': 'NIK tidak boleh kosong.',
                    'required': 'NIK wajib diisi.',
                    'unique': 'NIK sudah terdaftar.'
                }
            },
            'nama_lengkap': {
                'error_messages': {
                    'blank': 'Nama lengkap tidak boleh kosong.',
                    'required': 'Nama lengkap wajib diisi.'
                }
            },
            'alamat': {
                'error_messages': {
                    'blank': 'Alamat tidak boleh kosong.',
                    'required': 'Alamat wajib diisi.'
                }
            },
            'phone': {
                'error_messages': {
                    'blank': 'Nomor telepon tidak boleh kosong.',
                    'required': 'Nomor telepon wajib diisi.'
                }
            },
            'email': {
                'error_messages': {
                    'blank': 'Email tidak boleh kosong.',
                    'required': 'Email wajib diisi.',
                    'unique': 'Email sudah digunakan.'
                }
            },
            'role': {
                'error_messages': {
                    'blank': 'Role tidak boleh kosong.',
                    'required': 'Role wajib dipilih.',
                    'invalid_choice': 'Role yang dipilih tidak valid.'
                },
                'default': 'penanggungjawab'
            }
        }

    def validate_nik(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("NIK harus berupa angka")
        if len(value) != 16:
            raise serializers.ValidationError("NIK harus 16 digit angka")
        if User.objects.filter(nik=value).exists():
            raise serializers.ValidationError("NIK sudah digunakan")
        return value


    def generate_password(self):
        characters = string.ascii_uppercase + string.digits
        password = ''.join(random.choice(characters) for _ in range(10))
        if not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
            return self.generate_password()
        return password
    
    def create(self, validated_data):
        password = self.generate_password()
        validated_data['verifikasi'] = False

        ##buat user
        user = User.objects.create_user(
            nik = validated_data['nik'],
            password = password,
            nama_lengkap = validated_data['nama_lengkap'],
            email = validated_data['email'],
            alamat = validated_data['alamat'],
            phone = validated_data['phone'],
            role = validated_data['role']
        )

        send_mail(
            subject="Akun Anda Telah Terdaftar",
            message=f"""
        Halo, akun Anda berhasil didaftarkan.
        Silakan tunggu proses verifikasi oleh admin.
        Terima kasih.
        """,
            from_email="no-reply@website.com",
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user

class UserSerializer(serializers.ModelSerializer):
      class Meta:
        model = User
        fields = ['id', 'nik', 'nama_lengkap', 'alamat', 'phone', 'email', 'role', 'status_kaling', 'url_google_map']


class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"detail": "Password lama salah."})
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        if len(value) < 6:
            raise serializers.ValidationError({"detail": "Password harus minimal 6 karakter."})
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError({"detail": "Password harus mengandung setidaknya satu huruf besar."})
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError({"detail": "Password harus mengandung setidaknya satu angka."})
        if value == self.context['request'].user.password:  # Pastikan password baru tidak sama dengan yang lama
            raise serializers.ValidationError({"detail": "Password baru tidak boleh sama dengan password lama."})
        return value

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['nik', 'password']

    def validate(self, attrs):
        nik = attrs.get('nik')
        password = attrs.get('password')

        try:
            user = Login.objects.get(nik=nik)
        except Login.DoesNotExist:
            raise serializers.ValidationError({"message": "Akun anda belum diverifikasi."})

        
        if password and not check_password(password, user.password):
            raise serializers.ValidationError({"message": "Password anda salah."})

        if not password:
            raise serializers.ValidationError({"message": "Password tidak boleh kosong."})
        
        if user.role == "kaling":
            if user.status_kaling is None or user.status_kaling != "aktif":
                raise serializers.ValidationError({"message": "Akun kaling anda dinonaktifkan atau belum diverifikasi oleh admin."})

        attrs['user'] = user
        return attrs
    