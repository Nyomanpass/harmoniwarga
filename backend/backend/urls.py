from django.contrib import admin
from django.urls import path, include
from api.views import password_reset_confirm, password_reset_request
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('password-reset/', password_reset_request, name="password_reset"),
    path('password-reset-confirm/', password_reset_confirm, name="password_reset_confirm")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
