# Generated by Django 5.1.7 on 2025-05-09 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_login_status_kaling'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendatang',
            name='foto',
            field=models.ImageField(blank=True, null=True, upload_to='foto_pendatang/'),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='foto_ktp',
            field=models.ImageField(blank=True, null=True, upload_to='ktp_pendatang/'),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='golongan_darah',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='kabupaten_asal',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='kecamatan_asal',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='kelurahan_asal',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='kepala_lingkungan',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='provinsi_asal',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='rt',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='rw',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='tanggal_keluar',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='tanggal_lahir',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='tempat_lahir',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pendatang',
            name='wilayah',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='pendatang',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
