import React, { useState, useEffect } from 'react';
import api from "../../api";
import { toast } from 'react-toastify';
import MapPicker from '../MapPicker';
import WilayahSelector from '../WilayahSelector';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';

const AddAndUpdatePendatang = ({isEdit}) => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_ktp: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    golongan_darah: '',
    agama: '',
    provinsi_asal: '',
    kabupaten_asal: '',
    kecamatan_asal: '',
    kelurahan_asal: '',
    rt: '',
    rw: '',
    alamat_sekarang: '',
    latitude: '',
    longitude: '',
    tujuan_kedatangan: '',
    tanggal_datang: '',

    phone: '',
    deskripsi: '',
    foto: null,
    foto_ktp: null,
  });

  const [tujuanDatang, setTujuanDatang] = useState([]);
  const navigate = useNavigate()
  const url = localStorage.getItem('role')
  const {id} = useParams();

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/dashboard/pendatang/${id}/`)
        .then((res) => setFormData(res.data))
        .catch((err) => {
          console.log(err);
          toast.error('Server error, coba lagi nanti');
        });
    }
    fetchTujuanDatang();
  }, [isEdit, id]);

  const fetchTujuanDatang = async () => {
    try {
      const res = await api.get("/dashboard/tujuandatang/");
      setTujuanDatang(res.data);
    } catch (error) {
      console.error("Gagal fetch tujuan datang", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      const value = formData[key];
  
      if (value === null || value === '') continue;
      if ((key === 'foto' || key === 'foto_ktp') && value instanceof File) {
        data.append(key, value);
      }
      if (key !== 'foto' && key !== 'foto_ktp') {
        data.append(key, value);
      }
      
    }
  
  

    try {
      if (isEdit) {
        await api.put(`/dashboard/updatependatang/${id}/`, data);
        navigate(`/${url}/data-pendatang`)
        toast.success('Pendatang berhasil diubah');
      } else {
        await api.post('/dashboard/addpendatang/', data); 
        navigate(`/${url}/data-pendatang`)
        toast.success('Pendatang berhasil ditambahkan');
      }
     
    } catch (error) {
      if (error.response && error.response.data) {
        const errData = error.response.data;
        Object.keys(errData).forEach((field) => {
          const msg = Array.isArray(errData[field]) ? errData[field][0] : errData[field];
          toast.error(`${field}: ${msg}`);
        });
      } else {
        toast.error('Terjadi kesalahan, coba lagi nanti');
      }
    }
  };

  const handleLocationChange = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };
  

  return (
<form
  onSubmit={handleSubmit}
  className="p-6 m-6 bg-white shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6"
>
  {/* FOTO */}
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">Foto</label>
    <input
      type="file"
      name="foto"
      accept="image/*"
      onChange={handleChange}
      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>

  {/* FOTO KTP */}
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">Foto KTP</label>
    <input
      type="file"
      name="foto_ktp"
      accept="image/*"
      onChange={handleChange}
      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>

  {/* INPUT */}
  {[
    { label: 'NIK (Sesuai KTP)', name: 'no_ktp' },
    { label: 'Nama Lengkap', name: 'nama_lengkap' },
    { label: 'No Handphone', name: 'phone' },
    { label: 'Tempat Lahir', name: 'tempat_lahir' },
    { label: 'Tanggal Lahir', name: 'tanggal_lahir', type: 'date' },
    { label: 'Golongan Darah', name: 'golongan_darah' },
    { label: 'Agama', name: 'agama' },
  ].map((field) => (
    <div key={field.name}>
      <label className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
      <input
        type={field.type || 'text'}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  ))}
    {/* Select Jenis Kelamin */}
    <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">Jenis Kelamin</label>
    <select
      name="jenis_kelamin"
      value={formData.jenis_kelamin}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <option value="">Pilih Jenis Kelamin</option>
      <option value="laki-laki">Laki-laki</option>
      <option value="perempuan">Perempuan</option>
    </select>
  </div>

<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
  <WilayahSelector formData={formData} setFormData={setFormData} />
</div>

{/* INPUT */}
{[

    { label: 'RT', name: 'rt' },
    { label: 'RW', name: 'rw' },

  ].map((field) => (
    <div key={field.name}>
      <label className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
      <input
        type={field.type || 'text'}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  ))}


      <input
        type='hidden'
        name="latitude"
        value={formData.latitude}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <input
        type='hidden'
        name="longitude"
        value={formData.longitude}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />


  {/* Alamat */}
  <div className="md:col-span-2">
    <label className="block mb-1 text-sm font-medium text-gray-700">Alamat Sekarang</label>
    <textarea
      name="alamat_sekarang"
      value={formData.alamat_sekarang}
      onChange={handleChange}
      rows="3"
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

  {/* Map */}
  <div className="md:col-span-2">
    <label className="block mb-2 text-sm font-medium text-gray-700">Pilih Lokasi di Peta</label>
    <div className="h-[300px] overflow-hidden rounded-lg border">
      <MapPicker
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={handleLocationChange}
      />
    </div>
  </div>

  {/* Tujuan Kedatangan */}
  <div className="md:col-span-2">
    <label className="block mb-1 text-sm font-medium text-gray-700">Tujuan Kedatangan</label>
    <select
      name="tujuan_kedatangan"
      value={formData.tujuan_kedatangan}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <option value="">Pilih Tujuan Kedatangan</option>
      {tujuanDatang.map((item) => (
        <option key={item.id} value={item.id}>{item.tujuan_datang}</option>
      ))}
    </select>
  </div>

  {/* Tanggal Datang */}
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Datang</label>
    <input
      type="date"
      name="tanggal_datang"
      value={formData.tanggal_datang}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

  {/* Deskripsi */}
  <div className="md:col-span-2">
    <label className="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
    <textarea
      name="deskripsi"
      value={formData.deskripsi}
      onChange={handleChange}
      rows="3"
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

  {/* Tombol */}
  <div className="md:col-span-2 flex justify-end gap-3 pt-4">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
    >
      {isEdit ? 'Update' : 'Simpan'}
    </button>
    <Link
      to={`/penanggungjawab/data-pendatang`}
      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-md transition"
    >
      Kembali
    </Link>
  </div>
</form>

  );
};

export default AddAndUpdatePendatang;
