import React from "react";
import { ChevronLeft, ChevronRight, Eye, Trash2, Pencil} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

function AdminPenanggungjawab() {
  const [dataKaling, setDataKaling] = useState([])
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [totalData, setTotalData] = useState(0)
  const url = localStorage.getItem('role')

  useEffect(()=>{
    fetchKaling()
  },[search, limit, offset])

  const fetchKaling = async () => {
    try{
        const res = await api.get(`/dashboard/penanggungjawab/?search=${search}&limit=${limit}&offset=${offset}`)
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
            </div>
            <h1 className="px-4 py-5 text-xl font-semibold">Data Penanggung Jawab</h1>
            {/* Tabel */}
            <table className="min-w-full text-sm text-left">
          
            <thead className="bg-gray-50 text-gray-500 border-b text-md font-bold">
                <tr>
                <th className="px-4 py-5">Nik</th>
                <th className="px-4 py-5">Nama Lengkap</th>
                <th className="px-4 py-5">Phone</th>
                <th className="px-4 py-5">Email</th>
                <th className="px-4 py-5">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {dataKaling.length > 0 ? (
                dataKaling.map((pj, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-5 font-medium text-gray-800">{pj.nik}</td>
                    <td className="px-4 py-5 text-gray-600">{pj.nama_lengkap}</td>
                    <td className="px-4 py-5 text-gray-600">{pj.phone}</td>
                    <td className="px-4 py-5 text-gray-600">{pj.email}</td>
                    <td className="px-4 py-5 flex gap-2">
                        <Link
                            to={`/${url}/detail/penanggungjawab/${pj.id}`}
                            title="Lihat Detail"
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition"
                        >
                            <Eye size={20} />
                        </Link>
                        <Link
                            to={`/${url}/pendatang/edit/${pj.id}`}
                            title="Edit Pendatang"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 transition"
                        >
                            <Pencil size={20} />
                        </Link>

                        <button
                        onClick={() => {
                          if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
                            deletependatang(pj.id);
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

    </>
  );
}

export default AdminPenanggungjawab
