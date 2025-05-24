import { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

function AddUpdatePendatang({isEdit, editId ,onClose}) {

    const [formData, setFormData] = useState({
        nama_lengkap: "",
        no_ktp: "",
        alamat_asal: "",
        alamat_sekarang: "",
        tujuan_kedatangan: "",
        tanggal_datang: "",
        agama: "",
        deskripsi: "",
        jenis_kelamin: "",
        phone: "",
    });

    const [tujuanDatang, setTujuanDatang] = useState([])

    useEffect(()=>{
        if(isEdit && editId){
            api.get(`/dashboard/pendatang/${editId}/`)
                .then((res)=>setFormData(res.data))
                .catch((err)=>{
                    console.log(err)
                    toast.error('server error coba lagi nanti')
                })

        }
        fetchTujuanDatang()
    },[isEdit, editId])

    const fetchTujuanDatang = async () => {
        try {
            const res = await api.get("/dashboard/tujuandatang/")
            setTujuanDatang(res.data)
        } catch (error) {
            console.error("Gagal fetch tujuan datang", error)
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }    

        try {
            if(isEdit){
                await api.put(`/dashboard/updatependatang/${editId}/`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                toast.success('Pendatang berhasil dirubah');
            }else{
                await api.post("/dashboard/addpendatang/", data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                toast.success('Pendatang berhasil ditambahkan');
            }
            onClose()
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach((field) => {
                    const message = Array.isArray(errorData[field])
                        ? errorData[field][0]
                        : errorData[field];
                    toast.error(`${message}`);
                });
            } else {
                toast.error("Terjadi kesalahan, coba lagi nanti");
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                {isEdit ? 'Edit Pendatang' : 'Tambah Data Pendatang'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                    <label className="block mb-1 font-medium">Nama Lengkap</label>
                    <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" required />
                </div>

                {/* No KTP */}
                <div>
                    <label className="block mb-1 font-medium">No KTP</label>
                    <input type="text" name="no_ktp" value={formData.no_ktp} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" required />
                </div>

                {/* Alamat Asal */}
                <div>
                    <label className="block mb-1 font-medium">Alamat Asal</label>
                    <input type="text" name="alamat_asal" value={formData.alamat_asal} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                {/* Alamat Sekarang */}
                <div>
                    <label className="block mb-1 font-medium">Alamat Sekarang</label>
                    <input type="text" name="alamat_sekarang" value={formData.alamat_sekarang} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                {/* Tujuan Kedatangan */}
                <div>
                    <label className="block mb-1 font-medium">Tujuan Kedatangan</label>
                    <select
                        name="tujuan_kedatangan"
                        value={formData.tujuan_kedatangan}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">-- Pilih Tujuan --</option>
                        {tujuanDatang.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.tujuan_datang}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tanggal Datang */}
                <div>
                    <label className="block mb-1 font-medium">Tanggal Datang</label>
                    <input type="date" name="tanggal_datang" value={formData.tanggal_datang} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                {/* Agama */}
                <div>
                    <label className="block mb-1 font-medium">Agama</label>
                    <input type="text" name="agama" value={formData.agama} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                {/* Jenis Kelamin */}
                <div>
                    <label className="block mb-1 font-medium">Jenis Kelamin</label>
                    <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="laki-laki">Laki-laki</option>
                        <option value="perempuan">Perempuan</option>
                    </select>
                </div>

                {/* No HP */}
                <div>
                    <label className="block mb-1 font-medium">No HP</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Deskripsi</label>
                    <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 text-center">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition">
                       {isEdit ? 'Update' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUpdatePendatang;
