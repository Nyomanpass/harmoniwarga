import { useParams } from "react-router-dom";
import api from "../../api";
import { useEffect, useState } from "react";
import MapPicker from "../MapPicker";

// Fungsi format tanggal ke format lokal Indonesia
const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};



function DetailPendatang() {
    const { id } = useParams();
    const [pendatang, setPendatang] = useState({});
    const urlbackend = "http://localhost:8000"
    const [namaWilayah, setNamaWilayah] = useState({
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        kelurahan: "",
      });
      
      useEffect(() => {
        if (pendatang) {
          fetchNamaWilayah();
        }
      }, [pendatang]);
      
      const fetchNamaWilayah = async () => {
        try {
          const [provinsiRes, kabupatenRes, kecamatanRes, kelurahanRes] = await Promise.all([
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/province/${pendatang.provinsi_asal}.json`),
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regency/${pendatang.kabupaten_asal}.json`),
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/district/${pendatang.kecamatan_asal}.json`),
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/village/${pendatang.kelurahan_asal}.json`),
          ]);
      
          const [prov, kab, kec, kel] = await Promise.all([
            provinsiRes.json(),
            kabupatenRes.json(),
            kecamatanRes.json(),
            kelurahanRes.json(),
          ]);
      
          setNamaWilayah({
            provinsi: prov.name,
            kabupaten: kab.name,
            kecamatan: kec.name,
            kelurahan: kel.name,
          });
        } catch (error) {
          console.error("Gagal mengambil data wilayah:", error);
        }
      };
      

    useEffect(() => {
        getPendatangId();
    }, []);

    const getPendatangId = async () => {
        try {
            const response = await api.get(`/dashboard/pendatang/${id}/`);
            setPendatang(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    Detail Pendatang
                </h1>
                <button 
                    onClick={() => window.history.back()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                    Kembali
                </button>
            </div>
           

            <div className="bg-white shadow-md rounded-lg overflow-hidden p-10">
                <div className="divide-y">
                    <div className="flex gap-9 mb-10">
                    <img
                        src={`${urlbackend}${pendatang.foto}`} // Sesuaikan dengan URL backend kamu
                        alt="Foto Pendatang"
                        className="w-32 h-32 object-cover rounded"
                    />
                     <img
                        src={`http://localhost:8000${pendatang.foto_ktp}`} // Sesuaikan dengan URL backend kamu
                        alt="Foto Pendatang"
                        className="w-max h-32 object-cover rounded"
                    />
                    </div>
                    <DetailItem label="Nama Lengkap" value={pendatang.nama_lengkap} />
                    <DetailItem label="No KTP" value={pendatang.no_ktp} />
                    <DetailItem label="Provinsi Asal" value={namaWilayah.provinsi} />
                    <DetailItem label="Kabupaten Asal" value={namaWilayah.kabupaten} />
                    <DetailItem label="Kecamatan Asal" value={namaWilayah.kecamatan} />
                    <DetailItem label="Kelurahan Asal" value={namaWilayah.kelurahan} />
                    <DetailItem label="Alamat Sekarang" value={pendatang.alamat_sekarang} />
                    <DetailItem label="Tujuan Kedatangan" value={pendatang.tujuan_kedatangan_nama} />
                    <DetailItem label="Tanggal Datang" value={formatDate(pendatang.tanggal_datang)} />
                    <DetailItem label="Agama" value={pendatang.agama} />
                    <DetailItem label="Jenis Kelamin" value={pendatang.jenis_kelamin} />
                    <DetailItem label="Phone" value={pendatang.phone} />
                    <DetailItem label="Deskripsi" value={pendatang.deskripsi} />
                    <DetailItem label="Penanggungjawab" value={pendatang.penanggungjawab_nama} />
                    {/* Tampilkan Peta */}
                    {pendatang.latitude && pendatang.longitude && (
                    <MapPicker
                        latitude={pendatang.latitude}
                        longitude={pendatang.longitude}
                        readOnly={true}
                    />
                    )}

                </div>
            </div>
        </div>

        
    );
}

// Komponen untuk menampilkan label dan nilai
function DetailItem({ label, value }) {
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 px-4 py-5 bg-white">
            <div className="text-gray-600 font-medium">{label}</div>
            <div className="col-span-2 md:col-span-3 text-gray-900">{value || '-'}</div>
        </div>
    );
}

export default DetailPendatang;
