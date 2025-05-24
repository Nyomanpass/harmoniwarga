import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constant';
import axios from 'axios'; 
import { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordInput from "../components/PasswordInput";
import { Link } from "react-router-dom";
 
function Login() {
    const [nik, setNik] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const response = await axios.post('http://127.0.0.1:8000/api/loginuser/', { nik, password });
            
           
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            localStorage.setItem('role', response.data.role);
            
           
            navigate('/admin');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMsg = error.response.data.message;
        
                if (Array.isArray(errorMsg)) {
                    toast.error(errorMsg[0]); 
                } else {
                    toast.error('Login gagal, periksa NIK dan password');
                }
            } else {
                toast.error('Terjadi kesalahan sistem, coba lagi nanti');
            }
        }
    };

    return (
        <div className="min-h-screen flex">
           
            <div className="w-1/2 flex items-center justify-center px-10">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

                    <div>
                        <label className='block text-gray-700 text-sm mb-1'>NIK</label>
                        <input
                            type="text"
                            name='nik'
                            value={nik}
                            onChange={(e) => setNik(e.target.value)}
                            placeholder='Masukkan NIK'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div>
                        <PasswordInput
                            label="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar sekarang</Link>
                    </p>
                    <p className="text-center text-sm">
                        <Link to="/reset-password" className="text-blue-600 hover:underline">Lupa Password?</Link>
                    </p>
                </form>
            </div>

            {/* Kanan: Gambar & Deskripsi */}
            <div className="w-1/2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex flex-col justify-center items-center p-10 rounded-l-[40px]">
                <h1 className="text-4xl text-center font-bold mb-4">Selamat Datang di HarmoniWarga</h1>
                <p className="text-lg mb-6 text-center">Solusi Tertib Administrasi Penduduk</p>
                <img
                    src="/login.png"
                    alt="Illustration"
                    className="w-3/4 mx-auto"
                />
            </div>

        </div>
    );
}

export default Login;
