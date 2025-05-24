from django.urls import path
from . import views

urlpatterns = [
    path('kaling/', views.getKaling, name="getKaling"),
    path('kaling/<int:pk>/', views.detail_kaling, name="detailkaling"),
    path('penanggungjawab/', views.getPenanggungjawab, name="getPenanggungjawab"),
    path('penanggungjawab/<int:pk>/', views.detail_penanggungjawab, name="detailpenanggungjawab"),
    path('addpendatang/', views.addPendatang, name="addPendatang"),
    path('pendatang/', views.getPendatang, name="getpandatang"),
    path('getAdminPendatang/', views.getAdminPendatang, name="getAdminPendatang"),
    path('pendatang/<int:pk>/', views.detail_pendatang, name="detailPendatang"),
    path('updatependatang/<int:pk>/', views.update_pendatang, name="updatependatang"),
    path('tujuandatang/', views.tujuanDatang, name="tujuandatang"),
    path('getPendatangPj/<int:pk>/', views.getPendatangPj, name="getPendatangPj"),
    path('updateStatusKaling/<int:pk>/', views.update_status_kaling, name="updateStatusKaling"),
    path('pendatangperbulan/', views.pendatang_per_bulan, name="pendatangperbulan"),
    path('gettotalcount/', views.get_total_count, name="gettotalcount"),
    path('pendatangjenis/', views.pendatang_per_jenis_kelamin, name="pendatangjenis"),
    path('pendatangjenispj/', views.pendatang_per_jenis_kelamin_pj, name="pendatangjenispj"),
    path('toptujuandatang/', views.top_tujuan_kedatangan, name='toptujuandatang'),
    path('toptujuandatangpj/', views.top_tujuan_kedatangan_pj, name='toptujuandatangpj'),
    path('alamatsekarang/', views.top_alamat_pendatang, name="alamatsekarang")
]