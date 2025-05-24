import { Home, Settings, User, FileText, Menu, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen }) {
  const location = useLocation(); // Mendapatkan URL saat ini
  const url = localStorage.getItem('role')

  return (
    <aside
      className={`bg-white shadow-md w-64 h-screen p-5 fixed top-0 left-0 z-50 md:block 
        ${isOpen ? "block" : "hidden"} md:w-64 md:h-screen`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-lg">
          H
        </div>
        <span className="text-xl font-bold">HarmoniWarga</span>
      </div>

      {/* Menu */}
      <nav>
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link
              to={`/${url}`}
              className={`flex items-center gap-3 p-2 rounded-lg 
                ${
                  location.pathname === `/${url}`
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
            >
              <Home size={18} /> Dashboard
            </Link>
          </li>

          {/* Master Data */}
          <li className="text-gray-600 text-sm mt-4">Master Data</li>

          {url === "admin" && (
            <li>
              <Link
                to={`/${url}/data-kaling`}
                className={`flex items-center gap-3 p-2 rounded-lg 
                  ${
                    location.pathname === `/${url}/data-kaling`
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
              >
                <FileText size={18} /> Kaling
              </Link>
            </li>
          )}

        {(url === "admin" || url === "kaling") && (
          <li>
            <Link
              to={`/${url}/data-penanggungjawab`}
              className={`flex items-center gap-3 p-2 rounded-lg 
                ${
                  location.pathname === `/${url}/data-penanggungjawab`
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
            >
              <Settings size={18} /> Penanggung Jawab
            </Link>
          </li>
        )}

          <li>
            <Link
              to={`/${url}/data-pendatang`}
              className={`flex items-center gap-3 p-2 rounded-lg 
                ${
                  location.pathname === `/${url}/data-pendatang`
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
            >
              <Menu size={18} /> Pendatang
            </Link>
          </li>

          {/* Document */}
          <li className="text-gray-600 text-sm mt-4">Document</li>
          <li>
            <Link
               to={`/${url}/kartudomisili`}
              className={`flex items-center gap-3 p-2 rounded-lg 
                ${
                  location.pathname === `/${url}/kartudomisili`
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
            >
              <Lock size={18} /> Kartu Domisili
            </Link>
          </li>

          <li>
            <Link
              to={`/${url}/laporan`}
              className={`flex items-center gap-3 p-2 rounded-lg 
                ${
                  location.pathname === `/${url}/laporan`
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
            >
              <User size={18} /> Laporan
            </Link>
          </li>      
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
