
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

function AdminPendatang() {
  const [dataKaling, setDataKaling] = useState([])
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [totalData, setTotalData] = useState(0)
  const url = localStorage.getItem('role')
  const [tujuanKedatangan, setTujuanKedatangan] = useState([]);
  const [selectedTujuanId, setSelectedTujuanId] = useState('');
  const urlbackend = "http://localhost:8000"

  useEffect(() => {
    fetchKaling();
  }, [search, limit, offset, selectedTujuanId]); 
  
  useEffect(() => {
    fetchTujuanDatang();
  }, []); 
  

  const fetchKaling = async () => {
    try{
        const res = await api.get(`/dashboard/getAdminPendatang/?search=${search}&limit=${limit}&offset=${offset}&tujuan_id=${selectedTujuanId}`)
        if(res.data.count === 0){
            setDataKaling([])
        }else{
            setDataKaling(res.data.results)
        }
        setTotalData(res.data.count)
    }catch(error){
        if (error.response && error.response.status === 404){
            setDataKaling([])
            setTotalData(0)
        }
        console.log(error)
    }
  }

  const fetchTujuanDatang = async () => {
    try {
        const res = await api.get("/dashboard/tujuandatang/")
        setTujuanKedatangan(res.data)
    } catch (error) {
        console.error("Gagal fetch tujuan datang", error)
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
                <th className="px-4 py-5">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {dataKaling.length > 0 ? (
                dataKaling.map((kaling, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                   <td className="px-4 py-5">
                        <img
                            src={`${urlbackend}${kaling.foto}`}
                            alt="Foto Pendatang"
                            className="w-16 h-16 object-cover rounded-full"
                        />
                    </td>

                    <td className="px-4 py-5 font-medium text-gray-800">{kaling.no_ktp}</td>
                    <td className="px-4 py-5 text-gray-600">{kaling.nama_lengkap}</td>
                    <td className="px-4 py-5 text-gray-600">{kaling.phone}</td>
                    <td className="px-4 py-5">
                        <Link to={`/${url}/detail/pendatang/${kaling.id}`} className="text-white bg-blue-500 px-5 py-3 rounded-lg">detail</Link> 
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

    </>
  );
}

export default AdminPendatang
