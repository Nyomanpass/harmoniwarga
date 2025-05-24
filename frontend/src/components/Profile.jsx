import React, { useEffect, useState } from "react";
import { toast} from "react-toastify";
import api from "../api";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Phone, User, IdCard, MapPin, ShieldCheck, Map } from "lucide-react";
import PasswordInput from "./PasswordInput";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const url = localStorage.getItem('role')
  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    email: "",
    phone: "",
    alamat: "",
    role: "",
    url_google_map:""
  });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profile/");
        setProfile(response.data);
        setFormData(response.data); // isi formData dengan data awal
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/updateProfile/", formData); // atau PATCH tergantung API kamu
      toast.success("Profil berhasil diperbarui.");
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach((field) => {
          toast.error(`${errors[field]}`);
        });
      } else {
        toast.error("Gagal memperbarui profil.");
      }
    }
  };

  const updatePassword = async () => {
    try{
        const response = await api.post('/api/updatepassword/',{
            old_password: oldPassword,
            new_password: newPassword
        })
        if(response.status === 200){
            toast.success("Password berhasil diperbarui!")
            setShowModal(false)
        }
    }catch(error){
        if(error.response && error.response.data){
            const errors = error.response.data
            if(errors.old_password){
                toast.error(errors.old_password.message || "Password lama salah.")
            }
            if(errors.new_password){
                toast.error(errors.new_password.detail || "Password baru tidak valid.")
            }
        }else{
            toast.error("Terjadi kesalahan, coba lagi nanti")
        }
    }
  }


  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-10">Gagal memuat profil.</p>;

  return (
    <main className="flex-1 p-6 m-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Profile Anda</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NIK */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <IdCard size={16} /> NIK
          </label>
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-slate-100/30"
          />
        </div>

        {/* Nama Lengkap */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User size={16} /> Nama Lengkap
          </label>
          <input
            type="text"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-slate-100/30"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Mail size={16} /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-slate-100/30"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Phone size={16} /> Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-slate-100/30"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <ShieldCheck size={16} /> Role
          </label>
          <input
            type="text"
            value={formData.role}
            readOnly
            className="mt-2 block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-slate-100/30"
          />
        </div>

        {(url === "penanggungjawab") && (
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Map size={16} /> url goggle map
            </label>
            <input
              type="text"
              name="url_google_map"
              value={formData.url_google_map}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-slate-100/30"
            />
          </div>
        )}


        {/* Alamat */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin size={16} /> Alamat
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-slate-100/30"
          ></textarea>
        </div>

        {/* Role (tetap readOnly) */}
      

        {/* Tombol Aksi */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-start md:col-span-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow transition duration-200"
          >
            Reset Password
          </button>
        </div>
      </form>
      {showModal && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-6">Update Password</h2>

              <PasswordInput
                label="Password Lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <br/>

              <PasswordInput
                label="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            

              <div className="flex justify-end space-x-2 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePassword}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
    </main>


  );
}

export default Profile;
