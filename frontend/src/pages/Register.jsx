import api from '../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const [nik, setNik] = useState("");
    const [namaLengkap, setNamaLengkap] = useState("");
    const [alamat, setAlamat] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await api.post('/api/register/', {
                nik,
                nama_lengkap: namaLengkap,
                alamat,
                phone,
                email,
                role
            });
            toast.success("Pendaftaran berhasil, silahkan cek email anda");
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                alert("Terjadi kesalahan, coba lagi nanti");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Kiri - ilustrasi dan teks */}
            <div className="w-1/2 bg-gradient-to-br from-blue-600 to-purple-500 text-white p-10 flex flex-col justify-center rounded-r-3xl">
                <div className="text-4xl text-center font-bold mb-4">
                    HarmoniWarga
                </div>
                <p className="text-lg text-center">Mencatat, Mengelola, dan Menjaga Ketertiban Data Penduduk</p>
                <div className="mt-10">
                    <img src="/register.png" alt="Ilustrasi" className="w-3/4 mx-auto" />
                </div>
            </div>

            {/* Kanan - Formulir */}
            <div className="w-1/2 bg-white flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                    <h2 className="text-3xl font-semibold text-center mb-6">Daftarkan Akun Anda</h2>

                    {/* NIK */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">NIK</label>
                        <input
                            type="text"
                            value={nik}
                            onChange={(e) => setNik(e.target.value)}
                            placeholder="Masukkan NIK"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.nik && <p className="text-red-500 text-sm">{errors.nik[0]}</p>}
                    </div>

                    {/* Nama Lengkap */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.nama_lengkap && <p className="text-red-500 text-sm">{errors.nama_lengkap[0]}</p>}
                    </div>

                    {/* Alamat */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Alamat</label>
                        <input
                            type="text"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            placeholder="Masukkan alamat"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat[0]}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Nomor Telepon</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Masukkan nomor telepon"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Pilih Role --</option>
                            <option value="kaling">Kaling</option>
                            <option value="penanggungjawab">Penanggung Jawab</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role[0]}</p>}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-600 mt-4">
                       Sudah Punya Akun? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
