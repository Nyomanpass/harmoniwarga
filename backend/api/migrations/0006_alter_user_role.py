# Generated by Django 5.1.7 on 2025-04-20 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_login_nik'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('kaling', 'Kaling'), ('penanggungjawab', 'Penanggungjawab'), ('admin', 'Admin')], default='penanggungjawab', max_length=20),
        ),
    ]
