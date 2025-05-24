import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#A28EF5'];


function MainPenanggungjawab() {
  const [totalPendatang, setTotalPendatang] = useState(0);
  const [pendatangJenis, setPendatangJenis] = useState([])
  const [tujuanData, setTujuanData] = useState([])



  useEffect(() => {
    const fetchPendatangJenis = async () => {
      const res = await api.get('dashboard/pendatangjenispj/');
      setPendatangJenis(res.data)
    }
    

    const tujuanPendatang = async () => {
      try{
        const response = await api.get('dashboard/toptujuandatangpj/');
        setTujuanData(response.data)
      }catch(error){
        console.log('error fetching tujuan kedatangann')
      }
    }

    fetchPendatangJenis();
    tujuanPendatang()
  }, []);

  useEffect(() => {
    const fetchTotal = async () => {
      const res = await api.get('/dashboard/gettotalcount/');
      setTotalPendatang(res.data.total_pendatang_pj);
    };
    fetchTotal();
  }, []);



  return (
    <main className="p-6">
      {/* Statistik Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Kartu Statistik Total Pendatang */}
        <div className="bg-white p-4 rounded shadow-md">
          <p className="text-gray-500 mb-2">Total Pendatang</p>
          <h2 className="text-xl font-bold">{totalPendatang}</h2>
        </div>
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

export default MainPenanggungjawab;
