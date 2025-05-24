import { useState } from "react";
import { Outlet } from "react-router-dom"; // Tambahkan Outlet
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Konten utama */}
      <div className="flex-1 min-h-screen mt-4 md:ml-64">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Tampilkan halaman yang sesuai */}
        <Outlet />  
      </div>
    </div>
  );
}

export default Dashboard;
