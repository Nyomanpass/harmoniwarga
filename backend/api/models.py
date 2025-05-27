from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

import os
import uuid
from django.utils.deconstruct import deconstructible

@deconstructible
class PathAndRename:
    def __init__(self, sub_path):
        self.sub_path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        filename = f"{uuid.uuid4().hex}.{ext}"
        return os.path.join(self.sub_path, filename)


class CustomUserManager(BaseUserManager):
    def create_user(self, nik, email, password=None, **extra_fields):
        if not nik:
            raise ValueError("NIK harus diisi")
        if not email:
            raise ValueError("Email harus diisi")

        email = self.normalize_email(email)
        user = self.model(nik=nik, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, nik, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not password:
            raise ValueError("Superuser harus memiliki password")
        
        return self.create_user(nik, email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ("kaling", 'Kaling'),
        ('penanggungjawab', 'Penanggungjawab'),
        ('admin', 'Admin')
    ]

    STATUS_CHOICES = [
        ('aktif', 'Aktif'),
        ('tidak_aktif', 'Tidak Aktif')
    ]


    username = None
    nik = models.CharField(max_length=20, unique=True, error_messages={
            'unique': 'NIK sudah terdaftar.',
            'blank': 'NIK tidak boleh kosong.',
            'required': 'NIK wajib diisi.'
        })
    nama_lengkap = models.CharField(max_length=40)
    alamat = models.CharField(max_length=70)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=40, unique=True, error_messages={
            'unique': 'Email sudah digunakan.',
            'blank': 'Email tidak boleh kosong.',
            'required': 'Email wajib diisi.'
        })
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='penanggungjawab')
    verifikasi = models.BooleanField(default=False)

    status_kaling = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True)
    url_google_map = models.URLField(max_length=200, blank=True, null=True)

    USERNAME_FIELD = 'nik'
    REQUIRED_FIELDS = ['nama_lengkap', 'email', 'alamat', 'phone']
    objects = CustomUserManager()
    def __str__(self) -> str:
        return self.nik
    

class Login(models.Model):
    nik = models.CharField(max_length=20)
    password = models.CharField(max_length=255)
    nama_lengkap = models.CharField(max_length=100)
    role = models.CharField(max_length=20)
    status_kaling = models.CharField(max_length=100, blank=True, null=True)


class TujuanDatang(models.Model):
    tujuan_datang = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.tujuan_datang


class Pendatang(models.Model):
    ROLE_CHOICES = [
        ("laki-laki", "Laki-Laki"),
        ("perempuan", "Perempuan")
    ]

    nama_lengkap = models.CharField(max_length=255, blank=True, null=True)
    no_ktp = models.CharField(max_length=16, unique=True, blank=True, null=True)
    tempat_lahir = models.CharField(max_length=100, blank=True, null=True)
    tanggal_lahir = models.DateField(blank=True, null=True)
    jenis_kelamin = models.CharField(max_length=10, choices=ROLE_CHOICES, blank=True, null=True)
    golongan_darah = models.CharField(max_length=3, blank=True, null=True)  # A, B, AB, O
    agama = models.CharField(max_length=50, blank=True, null=True)
    
    provinsi_asal = models.CharField(max_length=100, blank=True, null=True)
    kabupaten_asal = models.CharField(max_length=100, blank=True, null=True)
    kecamatan_asal = models.CharField(max_length=100, blank=True, null=True)
    kelurahan_asal = models.CharField(max_length=100, blank=True, null=True)
    rt = models.CharField(max_length=10, blank=True, null=True)
    rw = models.CharField(max_length=10, blank=True, null=True)
    verifikasi = models.BooleanField(default=False, null=True)
    alasan_tolak = models.CharField(max_length=100, blank=True, null=True)

    alamat_sekarang = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    tujuan_kedatangan = models.ForeignKey(TujuanDatang, on_delete=models.SET_NULL, null=True, blank=True, related_name='tujuandatang')
    tanggal_datang = models.DateField(blank=True, null=True)

    deskripsi = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    penanggungjawab = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="pendatangs")

    foto = models.ImageField(upload_to=PathAndRename('foto_pendatang/'), blank=True, null=True)
    foto_ktp = models.ImageField(upload_to=PathAndRename('ktp_pendatang/'), blank=True, null=True)

    def __str__(self):
        return self.nama_lengkap if self.nama_lengkap else "Belum diisi"

