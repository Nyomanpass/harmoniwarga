from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register_user, name="register_user"),
    path('login/', views.MyTokenObtainPairView.as_view(), name="login"),
    path('loginuser/', views.login_user, name="loginuser"),
    path('refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('profile/', views.getProfile, name="getprofile"),
    path('updatepassword/', views.updatePassword, name="updatepassword"),
    path('listverifikasi/', views.get_verifikasi_user, name="verifikasiuser"),
    path('pendatangverifikasi/', views.get_verifikasi_pendatang, name="pendatangverifikasi"),
    path('deleteuser/<int:pk>/', views.delete_user, name="deleteuser"),
    path('deletependatang/<int:pk>/', views.delete_pendatang, name="deletependatang"),
    path('verifiuser/<int:pk>/', views.verifi_user, name="verifiuser"),
    path('verifipendatang/<int:pk>/', views.verifi_pendatang, name="verifipendatang"),
    path('tolakpendatang/<int:pk>/', views.tolak_pendatang, name="tolakpendatang"),
    path('updateProfile/', views.updateProfile, name="updateProfile")
]