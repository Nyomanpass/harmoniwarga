from api.models import User, Pendatang, TujuanDatang, Login
from rest_framework.decorators import api_view, permission_classes
from api.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
import re
from .serializers import TujuanDatangSerializer, PendatangSerializer
from django.db.models.functions import TruncMonth
from django.db.models import Count
from datetime import datetime
from django.http import JsonResponse
from django.db.models.functions import Lower
import os
from django.conf import settings



class Pagination(LimitOffsetPagination):
    default_limit = 2
    max_limit = 50

# API KHUSU KALING
# ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getKaling(request):
    search = request.GET.get('search', '')
    limit = request.GET.get('limit', 2)

    kaling = User.objects.filter(role="kaling",  verifikasi=True, nama_lengkap__icontains=search)
    if kaling.exists():
       paginator = Pagination()
       paginator.default_limit = int(limit)
       result_page = paginator.paginate_queryset(kaling, request)
       serializer = UserSerializer(result_page, many=True)
       return paginator.get_paginated_response(serializer.data)
    else:
        return Response({"message":"tidak ada data yang di temukan"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_kaling(request, pk):
    try:
        kaling = User.objects.get(id=pk, role="kaling")
    except User.DoesNotExist:
        return Response({"message":"kaling tidak terdaftar"}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(kaling)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_status_kaling(request, pk):
    print("🔧 MASUK VIEW update_status_kaling")

    try:
        kaling = User.objects.get(role="kaling", id=pk)
    except User.DoesNotExist:
        return Response({'error':'user tidak terdaftar'}, status=status.HTTP_400_BAD_REQUEST)
    
    status_kaling = request.data.get('status_kaling')
    if status_kaling not in ['aktif', 'tidak_aktif']:
        return Response({'error':'status hanya aktif dan tidak_aktif'}, status=status.HTTP_400_BAD_REQUEST)
    
    kaling.status_kaling = status_kaling
    kaling.save()
    Login.objects.update_or_create(
        id=kaling.id,
        defaults = {
            'status_kaling': kaling.status_kaling,
        }
    )

    return Response({"message":"status kaling berhasil diperbarui","status kaling": kaling.status_kaling}, status=status.HTTP_200_OK)


# API KHUSU PENANGGUNGJAWAB
# ==========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPenanggungjawab(request):
    search = request.GET.get('search', '')
    limit = request.GET.get('limit', 2)

    penanggungjawab = User.objects.filter(role="penanggungjawab", verifikasi=True,  nama_lengkap__icontains=search)
    if penanggungjawab.exists():
        paginator = Pagination()
        paginator.default_limit = int(limit)
        result_page = paginator.paginate_queryset(penanggungjawab, request)
        serializer = UserSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    else:
        return Response({"message":"tidak ada data yang di temukan"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_penanggungjawab(request, pk):
    try:
        penanggungjawab = User.objects.get(id=pk, role="penanggungjawab")
    except User.DoesNotExist:
        return Response({"message":"pendatang tidak terdaftar"}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(penanggungjawab)
    return Response(serializer.data, status=status.HTTP_200_OK)

# API KHUSU PENDATANG
# =====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addPendatang(request):
    user = request.user

    try:  
        data = request.data.copy()
        data['penanggungjawab_id'] = user.id
        data['verifikasi'] = False

        no_ktp = data.get("no_ktp")
        if no_ktp:
            if not re.fullmatch(r"^\d{16}$", no_ktp):
                return Response({"no_ktp":"nomor ktp harus 16 digit dan hanya berisi angka"}, status=status.HTTP_400_BAD_REQUEST)

            if Pendatang.objects.filter(no_ktp=no_ktp).exists():
                return Response({'no_ktp':'nomor ktp sudah terdaftar, periksa kembali'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PendatangSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPendatang(request):
    search = request.GET.get('search', '')
    limit = request.GET.get('limit', 2)
    user = request.user
    tujuan_pendatang = request.GET.get('tujuan_id')

    pendatang = Pendatang.objects.filter(penanggungjawab_id=user.id, nama_lengkap__icontains=search)

    if tujuan_pendatang:
        pendatang = pendatang.filter(tujuan_kedatangan_id=tujuan_pendatang)


    if pendatang.exists():
        paginator = Pagination()
        paginator.default_limit = int(limit)
        result_page = paginator.paginate_queryset(pendatang, request)
        serializer = PendatangSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    else:
        return Response({"message":"tidak ada data yang di temukan"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAdminPendatang(request):
    search = request.GET.get('search', '')
    limit = request.GET.get('limit', 2)
    tujuan_pendatang = request.GET.get('tujuan_id')

    pendatang = Pendatang.objects.filter(nama_lengkap__icontains=search, verifikasi=True)

    if tujuan_pendatang:
        pendatang = pendatang.filter(tujuan_kedatangan_id=tujuan_pendatang)

    if pendatang.exists():
        paginator = Pagination()
        paginator.default_limit = int(limit)
        result_page = paginator.paginate_queryset(pendatang, request)
        serializer = PendatangSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    else:
        return Response({"message":"tidak ada data yang di temukan"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllPendatang(request):
    pendatang = Pendatang.objects.filter(verifikasi=True)
    serializer = PendatangSerializer(pendatang, many=True)
    return Response(serializer.data)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_pendatang(request, pk):
    try:
        pendatang = Pendatang.objects.get(id=pk)
    except Pendatang.DoesNotExist:
        return Response({"message":"pendatang tidak terdaftar"}, status=status.HTTP_404_NOT_FOUND)
    serializer = PendatangSerializer(pendatang)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPendatangPj(request, pk):
    search = request.GET.get('search', '')
    limit = request.GET.get('limit', 2)
    tujuan_pendatang = request.GET.get('tujuan_id')
   
    pendatang = Pendatang.objects.filter(penanggungjawab_id=pk, nama_lengkap__icontains=search)

    if tujuan_pendatang:
        pendatang = pendatang.filter(tujuan_kedatangan_id=tujuan_pendatang)

    if pendatang.exists():
        paginator = Pagination()
        paginator.default_limit = int(limit)
        result_page = paginator.paginate_queryset(pendatang, request)
        serializer = PendatangSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    else:
        return Response({"message":"tidak ada data yang di temukan"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_pendatang(request, pk):
   
    try:
        pendatang = Pendatang.objects.get(id=pk)

        # if pendatang.penanggungjawab_id != user.id:
        #     return Response({"error": "tidak memiliki izin mengubah data pendatang ini"}, status=status.HTTP_403_FORBIDDEN)

        no_ktp = request.data.get("no_ktp")
        if no_ktp:
            if not re.fullmatch(r"^\d{16}$", no_ktp):
                return Response({"no_ktp": "nomor ktp harus 16 digit dan hanya berisi angka"}, status=status.HTTP_400_BAD_REQUEST)

            if Pendatang.objects.filter(no_ktp=no_ktp).exclude(id=pendatang.id).exists():
                return Response({'no_ktp': 'nomor ktp sudah terdaftar, periksa kembali'}, status=status.HTTP_400_BAD_REQUEST)

        # Cek dan handle perubahan gambar
        if 'foto' in request.FILES:
            if pendatang.foto:
                old_foto_path = os.path.join(settings.MEDIA_ROOT, str(pendatang.foto))
                if os.path.exists(old_foto_path):
                    os.remove(old_foto_path)

        if 'foto_ktp' in request.FILES:
            if pendatang.foto_ktp:
                old_ktp_path = os.path.join(settings.MEDIA_ROOT, str(pendatang.foto_ktp))
                if os.path.exists(old_ktp_path):
                    os.remove(old_ktp_path)

        serializer = PendatangSerializer(pendatang, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Pendatang.DoesNotExist:
        return Response({"error": "pendatang tidak terdaftar"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tujuanDatang(request):
    try:
        tujuandatang = TujuanDatang.objects.all()
    except TujuanDatang.DoesNotExist:
        return Response({"message":"tujuan datang tidak terdaftar"}, status=status.HTTP_404_NOT_FOUND)
    serializer = TujuanDatangSerializer(tujuandatang, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# dashboard
# ==========
@api_view(['GET'])
@permission_classes([AllowAny])
def pendatang_per_bulan(request):
    tahun_sekarang = datetime.now().year
    tahun_mulai = tahun_sekarang - 2 

    # Mengambil data pendatang dalam rentang dua tahun terakhir
    data = (
        Pendatang.objects
        .filter(tanggal_datang__year__gte=tahun_mulai, tanggal_datang__year__lte=tahun_sekarang)
        .annotate(month=TruncMonth('tanggal_datang'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    # Membuat struktur data lengkap dengan 12 bulan untuk setiap tahun dalam rentang
    result = []
    for tahun in range(tahun_mulai, tahun_sekarang + 1):
        for bulan in range(1, 13):
            bulan_tahun = datetime(tahun, bulan, 1)
            count = next((d['count'] for d in data if d['month'].year == tahun and d['month'].month == bulan), 0)
            result.append({
                'name': bulan_tahun.strftime('%b %Y'),
                'total': count
            })

    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_total_count(request):
    user = request.user
    total_kaling = User.objects.filter(role="kaling",  verifikasi=True).count()
    total_penanggungjawab = User.objects.filter(role="penanggungjawab",  verifikasi=True).count()
    total_pendatang = Pendatang.objects.filter(verifikasi=True).count()
    total_pendatang_pj =  Pendatang.objects.filter(penanggungjawab_id=user.id).count()
    
    return Response({
        "total_kaling":total_kaling,
        "total_penanggungjawab":total_penanggungjawab,
        "total_pendatang":total_pendatang,
        "total_pendatang_pj":total_pendatang_pj
    },status=status.HTTP_200_OK)




@api_view(['GET'])
@permission_classes([AllowAny])
def pendatang_per_jenis_kelamin(request):
    data = (
        Pendatang.objects
        .annotate(jenis_kelamin_lower=Lower('jenis_kelamin'))
        .values('jenis_kelamin_lower')
        .annotate(total=Count('id'))
        .order_by('jenis_kelamin_lower')
    )

    return JsonResponse(list(data), safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def pendatang_per_jenis_kelamin_pj(request):
    user = request.user

    data = (
        Pendatang.objects
        .filter(penanggungjawab_id=user.id)  
        .annotate(jenis_kelamin_lower=Lower('jenis_kelamin'))
        .values('jenis_kelamin_lower')
        .annotate(total=Count('id'))
        .order_by('jenis_kelamin_lower')
    )

    return JsonResponse(list(data), safe=False)



@api_view(['GET'])
@permission_classes([AllowAny])
def top_tujuan_kedatangan(request):
    data = (
        Pendatang.objects
        .values('tujuan_kedatangan__tujuan_datang')
        .annotate(jumlah_pendatang=Count('id'))
        .order_by('-jumlah_pendatang')[:5]
    )

    # Rename key agar rapi
    hasil = [
        {
            "tujuan_datang": item['tujuan_kedatangan__tujuan_datang'],
            "jumlah_pendatang": item['jumlah_pendatang']
        } for item in data
    ]

    return JsonResponse(hasil, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def top_tujuan_kedatangan_pj(request):
    user = request.user
    data = (
        Pendatang.objects
        .filter(penanggungjawab_id=user.id)  
        .values('tujuan_kedatangan__tujuan_datang')
        .annotate(jumlah_pendatang=Count('id'))
        .order_by('-jumlah_pendatang')[:5]
    )

    # Rename key agar rapi
    hasil = [
        {
            "tujuan_datang": item['tujuan_kedatangan__tujuan_datang'],
            "jumlah_pendatang": item['jumlah_pendatang']
        } for item in data
    ]

    return JsonResponse(hasil, safe=False)



@api_view(['GET'])
@permission_classes([AllowAny])
def top_alamat_pendatang(request):
    data = (
        Pendatang.objects
        .values('alamat_sekarang')
        .annotate(jumlah_pendatang=Count('id'))
        .order_by('-jumlah_pendatang')[:5]
    )

    return JsonResponse(list(data), safe=False)
