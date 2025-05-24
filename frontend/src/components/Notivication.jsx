import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { User, Users } from "lucide-react";
import api from "../api";


function Notivication() {
  // Data Dummy
  const [users, setUsers] = useState([]);
  const [pendatang, setPendatang] = useState([])
  const [loading, setLoading] = useState(null);


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
    try{
        await api.put(`/api/${category}/${id}/`);
        setUsers(users.filter((user)=>user.id !== id))
        toast.success("berhasil diverifikasi!");
    }catch(error){
        console.log("error to verifiuser")
    }finally {
        setLoading(null); // Selesai loading
    }
  }
 

  const deleteuser = async (id) =>{
    try{
        await api.delete(`/api/deleteuser/${id}/`)
        setUsers(users.filter((user)=>user.id !== id))
        toast.success("User berhasil dihapus!");
    }catch(error){
        console.log("error detele user")
    }
  }



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
                  <td className="p-3">{user.no_ktp}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role === "penanggungjawab" ? "Penanggung Jawab" : user.role === "kaling" ? "Kepala Lingkungan" : user.role}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    {!user.verified && (
                      <button 
                          onClick={() => verifiUser(user.id, 'verifiuser')} 
                          className="bg-green-500 rounded-lg text-white px-3 py-1 mr-2"
                          disabled={loading === user.id}
                      >
                          {loading === user.id ? "Loading..." : "Verifikasi"}
                      </button>
                    )}
                    <button
                      onClick={() => deleteuser(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Hapus
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
                  <td className="p-3 flex justify-center space-x-2">
                    {!user.verified && (
                      <button 
                          onClick={() => verifiUser(user.id, 'verifipendatang')} 
                          className="bg-green-500 rounded-lg text-white px-3 py-1 mr-2"
                          disabled={loading === user.id}
                      >
                          {loading === user.id ? "Loading..." : "Verifikasi"}
                      </button>
                    )}
                    <button
                      onClick={() => deleteuser(user.id)}
                      className="bg-red-500 text-white rounded-lg px-4 py-2  hover:bg-red-600 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
}

export default Notivication;
