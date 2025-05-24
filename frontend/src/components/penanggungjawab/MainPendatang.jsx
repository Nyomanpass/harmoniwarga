
import React from "react";
import { ChevronLeft, ChevronRight, Eye, Trash2, Pencil} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MainPendatang() {
  const [dataPendatang, setDataPendatang] = useState([])
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [totalData, setTotalData] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const url = localStorage.getItem('role')
  const [tujuanKedatangan, setTujuanKedatangan] = useState([]);
  const [selectedTujuanId, setSelectedTujuanId] = useState('');
  const urlbackend = "http://localhost:8000"

  useEffect(()=>{
    fetchPendatang()
  },[search, limit, offset, selectedTujuanId])


  useEffect(() => {
    fetchTujuanDatang();
  }, []); 
  


  const fetchTujuanDatang = async () => {
    try {
        const res = await api.get("/dashboard/tujuandatang/")
        setTujuanKedatangan(res.data)
    } catch (error) {
        console.error("Gagal fetch tujuan datang", error)
    }
}


  const fetchPendatang = async () => {
    try{
        const res = await api.get(`/dashboard/pendatang/?search=${search}&limit=${limit}&offset=${offset}&tujuan_id=${selectedTujuanId}`)
        if(res.data.count === 0){
            setDataPendatang([])
        }else{
            setDataPendatang(res.data.results)
        }
        setTotalData(res.data.count)
    }catch(error){
        if (error.response && error.response.status === 404){
            setDataPendatang([])
            setTotalData(0)
        }
        console.log(error)
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setOffset(0)
  }

  const handleNextPage = () => {
    if (offset + limit < totalData){
        setOffset(offset + limit)
    }
  }

  const handlePrevPage = () => {
    if (offset >= limit){
        setOffset(offset - limit)
    }
  }

  const deletependatang = async (id) =>{
    try{
        await api.delete(`/api/deletependatang/${id}/`)
        setDataPendatang(dataPendatang.filter((user)=>user.id !== id))
        toast.success("pendatang berhasil dihapus!");
    }catch(error){
        console.log("error detele user")
    }
  }

  return (
    <>
    <div className="p-6">
        <div className="bg-white shadow rounded-xl overflow-x-auto">
            
            {/* Search & Limit */}
            <div className="flex flex-wrap px-4 py-5 gap-4 items-center">
            <input
                type="text"
                placeholder="Cari Nama..."
                value={search}
                onChange={handleSearchChange}
                className="border border-gray-300 p-2 rounded-lg w-64 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
                <option value={10}>10 data</option>
                <option value={25}>25 data</option>
                <option value={50}>50 data</option>
            </select>
            <select
                value={selectedTujuanId}
                onChange={(e) => {
                    setSelectedTujuanId(e.target.value);
                    setOffset(0); // reset halaman
                }}
                className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                <option value="">Semua Tujuan</option>
                {tujuanKedatangan.map((tujuan) => (
                    <option key={tujuan.id} value={tujuan.id}>
                    {tujuan.tujuan_datang}
                    </option>
                ))}
            </select>

            <Link to={`/${url}/pendatang`} className="px-5 py-2 text-white rounded-lg bg-green-500">
                tambah pendatang
            </Link>

            </div>
            <h1 className="px-4 py-5 text-xl font-semibold">Data Pendatang</h1>
            {/* Tabel */}
            <table className="min-w-full text-sm text-left">
          
            <thead className="bg-gray-50 text-gray-500 border-b text-md font-bold">
                <tr>
                <th className="px-4 py-5">Image</th>
                <th className="px-4 py-5">Nik</th>
                <th className="px-4 py-5">Nama Lengkap</th>
                <th className="px-4 py-5">Phone</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-4 py-5">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {dataPendatang.length > 0 ? (
                dataPendatang.map((pendatang, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-5">
                        <img
                            src={`${urlbackend}${pendatang.foto}`}
                            alt="Foto Pendatang"
                            className="w-16 h-16 object-cover rounded-full"
                        />
                    </td>
                    <td className="px-4 py-5 font-medium text-gray-800">{pendatang.no_ktp}</td>
                    <td className="px-4 py-5 text-gray-600">{pendatang.nama_lengkap}</td>
                    <td className="px-4 py-5 text-gray-600">{pendatang.phone}</td>
                    <td className="px-4 py-5">
                        {pendatang.verifikasi ? (
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            Diterima
                            </span>
                        ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                            Pending
                            </span>
                        )}
                    </td>
                    <td className="px-4 py-5 flex gap-2">
                        <Link
                            to={`/${url}/detail/pendatang/${pendatang.id}`}
                            title="Lihat Detail"
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition"
                        >
                            <Eye size={20} />
                        </Link>
                        <Link
                            to={`/${url}/pendatang/edit/${pendatang.id}`}
                            title="Edit Pendatang"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 transition"
                        >
                            <Pencil size={20} />
                        </Link>

                        <button
                        onClick={() => {
                          if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
                            deletependatang(pendatang.id);
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
                ) : (
                <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    Data Penanggung Jawab tidak ditemukan.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>
            Menampilkan {offset + 1} sampai {Math.min(offset + limit, totalData)} dari {totalData} data
            </span>
            <div className="flex gap-2 items-center">
            <button
                onClick={handlePrevPage}
                disabled={offset === 0}
                className={`px-4 py-2 border rounded flex items-center gap-2 ${
                offset === 0 ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
            >
                <ChevronLeft size={20} /> Prev
            </button>
            <button
                onClick={handleNextPage}
                disabled={offset + limit >= totalData}
                className={`px-4 py-2 border rounded flex items-center gap-2 ${
                offset + limit >= totalData ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
            >
                Next <ChevronRight size={20} />
            </button>
            </div>
        </div>
        </div>

        {/* modal box  */}
        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
            >
                &times;
            </button>

            </div>
        </div>
        )}

    </>
  );
}

export default MainPendatang
