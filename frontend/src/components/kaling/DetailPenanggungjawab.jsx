import { useParams } from "react-router-dom";
import api from "../../api";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom'


function DetailPenanggungjawab() {
    const { id } = useParams();
    const [penanggungjawab, setPenanggungjawab] = useState({});
    const [pendatangPj, setPendatangPj] = useState([])
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState(0)
    const url = localStorage.getItem('role')
    const [tujuanKedatangan, setTujuanKedatangan] = useState([]);
    const [selectedTujuanId, setSelectedTujuanId] = useState('');
  
  
  
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
  

    useEffect(() => {
        getPenanggungjawabId();
        getPendatangPj()
    }, [search, limit, offset, selectedTujuanId]);
 
    const getPenanggungjawabId = async () => {
        try {
            const response = await api.get(`/dashboard/penanggungjawab/${id}/`);
            setPenanggungjawab(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getPendatangPj = async () => {
        try{
            const res = await api.get(`/dashboard/getPendatangPj/${id}/?search=${search}&limit=${limit}&offset=${offset}&tujuan_id=${selectedTujuanId}`)
            if(res.data.count === 0){
                setPendatangPj([])
            }else{
                setPendatangPj(res.data.results)
            }
            setTotalData(res.data.count)
        }catch(error){
            if (error.response && error.response.status === 404){
                setPendatangPj([])
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
        <div className="mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    Detail Penanggung Jawab
                </h1>
                <button 
                    onClick={() => window.history.back()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                    Kembali
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden px-6 py-8">
                <div className="divide-y">
                    <DetailItem label="Nama Lengkap" value={penanggungjawab.nama_lengkap} />
                    <DetailItem label="Nik" value={penanggungjawab.nik} />
                    <DetailItem label="Alamat" value={penanggungjawab.alamat} />
                    <DetailItem label="Email" value={penanggungjawab.email} />
                    <DetailItem label="Phone" value={penanggungjawab.phone} />
                    {penanggungjawab.url_google_map ? (
                        <DetailItem
                            label="Google Map"
                            value={
                            <a
                                href={penanggungjawab.url_google_map}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Lihat di Google Map
                            </a>
                            }
                        />
                        ) : (
                        <DetailItem label="Google Map" value="Tidak tersedia" />
                    )}

                </div>
            </div>
    

        <div className="bg-white shadow rounded-xl px-6 py-8 mt-8 mx-auto">
                    
            {/* Search & Limit */}
            <div className="flex flex-wrap  py-5 gap-4 items-center">
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
            <h1 className="py-5 text-xl font-semibold">Data Pendatang</h1>
            {/* Tabel */}
            <table className="min-w-full text-sm text-left">

            <thead className="bg-gray-50 text-gray-500 border-b text-md font-bold">
                <tr>
                <th className="px-4 py-5">Nik</th>
                <th className="px-4 py-5">Nama Lengkap</th>
                <th className="px-4 py-5">Phone</th>
                <th className="px-4 py-5">Alamat Asal</th>
                <th className="px-4 py-5">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {pendatangPj.length > 0 ? (
                pendatangPj.map((pendatang, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-5 font-medium text-gray-800">{pendatang.no_ktp}</td>
                    <td className="px-4 py-5 text-gray-600">{pendatang.nama_lengkap}</td>
                    <td className="px-4 py-5 text-gray-600">{pendatang.phone}</td>
                    <td className="px-4 py-5 text-gray-600">{pendatang.alamat_asal}</td>
                    <td className="px-4 py-5">
                        <Link to={`/${url}/detail/pendatang/${pendatang.id}`} className="text-white bg-blue-500 px-5 py-3 rounded-lg">detail</Link> 
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

// Komponen untuk menampilkan label dan nilai
function DetailItem({ label, value }) {
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 px-4 py-5 bg-white">
            <div className="text-gray-600 font-medium">{label}</div>
            <div className="col-span-2 md:col-span-3 text-gray-900">{value || '-'}</div>
        </div>
    );
}

export default DetailPenanggungjawab;
