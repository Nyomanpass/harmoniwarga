from api.models import Pendatang, TujuanDatang, User
from rest_framework import serializers

class PendatangSerializer(serializers.ModelSerializer):
    tujuan_kedatangan_nama = serializers.CharField(source='tujuan_kedatangan.tujuan_datang', read_only=True)
    penanggungjawab_nama = serializers.CharField(source='penanggungjawab.nama_lengkap', read_only=True)
    
    penanggungjawab_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='penanggungjawab', 
        write_only=True
    )

    class Meta:
        model = Pendatang
        fields = [
            'id', 'nama_lengkap', 'no_ktp', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
            'golongan_darah', 'agama', 'provinsi_asal', 'kabupaten_asal', 'kecamatan_asal',
            'kelurahan_asal', 'rt', 'rw',  'alamat_sekarang', 'latitude', 'longitude',
            'tujuan_kedatangan', 'tujuan_kedatangan_nama', 'tanggal_datang',
            'deskripsi', 'phone', 
            'penanggungjawab_id', 'penanggungjawab_nama',
            'foto', 'foto_ktp', 'verifikasi'
        ]


class TujuanDatangSerializer(serializers.ModelSerializer):
    class Meta:
        model = TujuanDatang
        fields = ['id', 'tujuan_datang']

