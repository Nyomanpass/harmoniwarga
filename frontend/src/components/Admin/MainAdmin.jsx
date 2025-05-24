import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#A28EF5'];


function MainAdmin() {
  const [totalKaling, setTotalKaling] = useState(0);
  const [totalPj, setTotalPj] = useState(0);
  const [totalPendatang, setTotalPendatang] = useState(0);
  const [pendatangBulan, setPendatangBulan] = useState([]);
  const [pendatangJenis, setPendatangJenis] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dataPendatang, setDataPendatang] = useState([])
  const [tujuanData, setTujuanData] = useState([])
  const url = localStorage.getItem('role')


  useEffect(() => {
    const fetchPendatangPerBulan = async () => {
      const res = await api.get('dashboard/pendatangperbulan/');
      setPendatangBulan(res.data);
    };
    const fetchPendatangJenis = async () => {
      const res = await api.get('dashboard/pendatangjenis/');
      setPendatangJenis(res.data)
    }
    const fetchData = async () => {
      try {
        const response = await api.get("dashboard/alamatsekarang/");
        const data = response.data
        
        const mappedData = data.map((item) => {
          const parts = item.alamat_sekarang.split(',');
          const namaWilayah = parts.slice(0, 2).join(',').trim(); // Gabung elemen ke-0 dan ke-1
        
          return {
            namaWilayah,
            jumlah: item.jumlah_pendatang
          };
        });
        
        setDataPendatang(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const tujuanPendatang = async () => {
      try{
        const response = await api.get('dashboard/toptujuandatang/');
        setTujuanData(response.data)
      }catch(error){
        console.log('error fetching tujuan kedatangann')
      }
    }

    fetchPendatangPerBulan();
    fetchPendatangJenis();
    fetchData();
    tujuanPendatang()
  }, []);

  useEffect(() => {
    const fetchTotal = async () => {
      const res = await api.get('/dashboard/gettotalcount/');
      setTotalKaling(res.data.total_kaling);
      setTotalPj(res.data.total_penanggungjawab);
      setTotalPendatang(res.data.total_pendatang);
    };
    fetchTotal();
  }, []);

  // Dapatkan daftar tahun unik dari data
  const years = [...new Set(pendatangBulan.map(item => item.name.split(' ')[1]))];

  // Filter data berdasarkan tahun yang dipilih
  const filteredData = pendatangBulan.filter(item => item.name.includes(selectedYear));

  return (
    <main className="p-6">
      {/* Statistik Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Kartu Statistik Total Kaling */}
        {(url === "admin") && (
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-gray-500 mb-2">Total Kaling</p>
            <h2 className="text-xl font-bold">{totalKaling} <span className="text-sm font-normal text-gray-600">orang</span></h2>
          </div>
        )}

        {/* Kartu Statistik Total Penanggung Jawab */}
        <div className="bg-white p-4 rounded shadow-md">
          <p className="text-gray-500 mb-2">Total Penanggung Jawab</p>
          <h2 className="text-xl font-bold">{totalPj} <span className="text-sm font-normal text-gray-600">orang</span></h2>
        </div>
        {/* Kartu Statistik Total Pendatang */}
        <div className="bg-white p-4 rounded shadow-md">
          <p className="text-gray-500 mb-2">Total Pendatang</p>
          <h2 className="text-xl font-bold">{totalPendatang}</h2>
        </div>
      </div>

                {/* Dropdown Pilihan Tahun */}
      <div className="mb-4">
        <label htmlFor="yearSelect" className="block text-gray-700">Pilih Tahun:</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Grafik Pendatang per Bulan */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-3">Pendatang per Bulan - {selectedYear}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>



      
      <div className="grid grid-cols-2 gap-5 mt-5">
  {/* Grafik Distribusi Pendatang Berdasarkan Jenis Kelamin */}
  <div className="bg-white p-6 rounded shadow-md  flex-3/4 min-w-[300px]">
    <h3 className="text-lg font-bold mb-3">Distribusi Pendatang Berdasarkan Jenis Kelamin</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={pendatangJenis}>
        <XAxis dataKey="jenis_kelamin_lower" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#3b82f6" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Grafik Distribusi Pendatang per Wilayah */}
  <div className="bg-white p-6 pb-14 rounded shadow-md h-[400px] flex-1 min-w-[300px]">
  <h3 className="text-lg font-bold mb-3">Distribusi wilayah pendatang terbanyak</h3>
  <ResponsiveContainer width="100%" aspect={1.3}>
    <PieChart>
      <Pie
        data={dataPendatang}
        dataKey="jumlah"
        nameKey="namaWilayah"
        cx="50%"
        cy="50%"
        outerRadius={100}
        labelLine={true}
        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
      >
        {dataPendatang.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name, props) => [`${value} pendatang`, props.payload.namaWilayah]}
      />
      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
    </PieChart>
  </ResponsiveContainer>
</div>


<div className="bg-white p-6 pb-14 rounded shadow-md h-[400px] flex-1 min-w-[300px]">
  <h3 className="text-lg font-bold mb-3">Distribusi tujuan pendatang</h3>
  <ResponsiveContainer width="100%" aspect={1.3}>
    <PieChart>
      <Pie
        data={tujuanData}
        dataKey="jumlah_pendatang"
        nameKey="tujuan_datang"
        cx="50%"
        cy="50%"
        outerRadius={100}
        labelLine={true}
        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
      >
        {tujuanData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name, props) => [`${value} pendatang`, props.payload.tujuan_datang]}
      />
      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
    </PieChart>
  </ResponsiveContainer>
</div>

</div>

    </main>
  );
}

export default MainAdmin;
