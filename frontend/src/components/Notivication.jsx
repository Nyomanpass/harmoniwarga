import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { User, Users, CheckCircle, Eye, Trash2, XCircle } from "lucide-react";
import { Link } from 'react-router-dom'
import api from "../api";


function Notivication() {
  // Data Dummy
  const [users, setUsers] = useState([]);
  const [pendatang, setPendatang] = useState([])
  const [loading, setLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [alasanTolak, setAlasanTolak] = useState('')
  const url = localStorage.getItem('role')


  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(()=>{
    const fetchUsers = async () => {
        try{
            const res = await api.get('/api/listverifikasi/')
            setUsers(res.data)
        }catch(error){
            console.log("error fetching users")
        }
    }

    const fetchPendatang = async () => {
      try{
        const res = await api.get('/api/pendatangverifikasi/')
        setPendatang(res.data)
      }catch(error){
        console.log(error)
      }
    }

    fetchUsers();
    fetchPendatang();
  },[])
  

  const verifiUser = async (id, category) => {
    setLoading(id); 
    try {
      await api.put(`/api/${category}/${id}/`);
  
      if (category === 'verifiuser') {
        setUsers(users.filter((user) => user.id !== id));
      } else if (category === 'verifipendatang') {
        setPendatang(pendatang.filter((item) => item.id !== id));
      }
  
      toast.success("Berhasil diverifikasi!");
    } catch (error) {
      console.log("Error saat verifikasi:", error);
    } finally {
      setLoading(null);
    }
  };
  
  const deleteuser = async (id, category) => {
    try {
      await api.delete(`/api/${category}/${id}/`);
  
      if (category === 'deleteuser') {
        setUsers(users.filter((user) => user.id !== id));
      } else if (category === 'deletependatang') {
        setPendatang(pendatang.filter((item) => item.id !== id));
      }
  
      toast.success("Data berhasil dihapus!");
    } catch (error) {
      console.log("Error saat menghapus:", error);
    }
  };

  const handleReject = async (id) => {
    if (!alasanTolak.trim()) {
      toast.error("Alasan penolakan wajib diisi.");
      return;
    }
  
    try {
      await api.put(`/api/tolakpendatang/${id}/`, {
        alasan_tolak: alasanTolak
      });
  
      toast.success("Data berhasil ditolak!, pesan sudah terkirim");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menolak data.");
    } finally {
      setShowRejectModal(false);
      setRejectId(null);
      setAlasanTolak('');
    }
  };
  
  
  



  // Statistik
  const totalUsers = users.length;
  const totalPendatang = pendatang.length
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex my-5 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Verifikasi Users</h2>
        <h2 className="text-lg text-gray-800">{today}</h2>
      </div>
      {/* Statistik Pengguna */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center p-4 bg-blue-100 text-blue-800 rounded-lg shadow">
          <User className="text-blue-800 w-8 h-8 mr-3" />
          <div>
            <p className="text-lg font-semibold">Total Pengguna</p>
            <p className="text-xl font-bold">{totalUsers}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-blue-100 text-blue-800 rounded-lg shadow">
          <Users className="text-blue-800 w-8 h-8 mr-3" />
          <div>
            <p className="text-lg font-semibold">Total Pendatang</p>
            <p className="text-xl font-bold">{totalPendatang}</p>
          </div>
        </div>
      </div>

      {/* Tabel Verifikasi User */}
      <h1>Verifikasi User</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Nik</th>
              <th className="border p-3 text-left">Nama Lengkap</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Level</th>
              <th className="border p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  Tidak ada data pengguna untuk diverifikasi
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border hover:bg-gray-50">
                  <td className="p-3">{user.nik}</td>
                  <td className="p-3">{user.nama_lengkap}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role === "penanggungjawab" ? "Penanggung Jawab" : user.role === "kaling" ? "Kepala Lingkungan" : user.role}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    {/* Tombol Verifikasi (jika belum diverifikasi) */}
                    {!user.verified && (
                      <button
                        onClick={() => verifiUser(user.id, 'verifiuser')}
                        disabled={loading === user.id}
                        title="Verifikasi"
                        className={`rounded-full p-2 transition ${
                          loading === user.id
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {loading === user.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <CheckCircle size={20} />
                        )}
                      </button>
                    )}

                    {/* Tombol Detail */}
                    <Link
                      to={`/${url}/detail/${user.role}/${user.id}`}
                      onClick={() => handleView(user.id)}
                      title="Lihat Detail"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition"
                    >
                      <Eye size={20} />
                    </Link>

                    {/* Tombol Hapus */}
                    <button
                        onClick={() => {
                          if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
                            deleteuser(user.id, 'deleteuser');
                          }
                        }}
                        title="Hapus"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                      >
                        <Trash2 size={20} />
                      </button>

                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <h1>Verifikasi Pendatang</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Nik</th>
              <th className="border p-3 text-left">Nama Lengkap</th>
              <th className="border p-3 text-left">Alamat Sekarang</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendatang.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  Tidak ada data pengguna untuk diverifikasi
                </td>
              </tr>
            ) : (
              pendatang.map((user) => (
                <tr key={user.id} className="border hover:bg-gray-50">
                  <td className="p-3">{user.no_ktp}</td>
                  <td className="p-3">{user.nama_lengkap}</td>
                  <td className="p-3">{user.alamat_sekarang}</td>
                  <td className="px-4 py-5">
                        {user.verifikasi === true ? (
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            Diterima
                            </span>
                        ) : user.verifikasi === false ? (
                            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                            Pending
                            </span>
                        ) : (
                            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                            Ditolak
                            </span>
                        )}
                    </td>
                  <td className="p-3 flex justify-center space-x-2">
                    {/* Tombol Verifikasi (jika belum diverifikasi) */}
                    {!user.verified && (
                      <button
                        onClick={() => verifiUser(user.id, 'verifipendatang')}
                        disabled={loading === user.id}
                        title="Verifikasi"
                        className={`rounded-full p-2 transition ${
                          loading === user.id
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {loading === user.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <CheckCircle size={20} />
                        )}
                      </button>
                    )}

                    {!user.verified && (
                      <button
                        onClick={() =>{
                          setShowModal(true)
                          setRejectId(user.id);
                        }} // buka modal form
                        title="Tolak"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full p-2 transition"
                      >
                        <XCircle size={20} />
                      </button>
                    )}


                    {/* Tombol Detail */}
                    <Link
                      onClick={() => handleView(user.id)}
                      to={`/${url}/detail/pendatang/${user.id}`}
                      title="Lihat Detail"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition"
                    >
                      <Eye size={20} />
                    </Link>

                    {/* Tombol Hapus */}
                    <button
                      onClick={() => {
                        if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
                          deleteuser(user.id, 'deletependatang');
                        }
                      }}
                      title="Hapus"
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                    >
                      <Trash2 size={20} />
                    </button>

                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-lg font-semibold mb-4">Tolak Verifikasi</h2>
          <textarea
            className="w-full border border-gray-300 rounded p-2 mb-4"
            rows={4}
            value={alasanTolak}
            onChange={(e) => setAlasanTolak(e.target.value)}
            placeholder="Masukkan alasan penolakan..."
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowModal(false);
                setRejectId(null)
                setAlasanTolak('');
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Batal
            </button>
            <button
              onClick={() => {handleReject(rejectId); setShowModal(false);}}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Kirim Penolakan
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default Notivication;
