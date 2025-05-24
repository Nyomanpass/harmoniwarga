import { useState, useEffect } from "react";
import { User, LogOut, Bell } from "lucide-react"; 
import { Link } from "react-router-dom";
import api from "../api";

function ProfileDrapdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0); // Contoh jumlah notifikasi
  const [notifCountDua, setNotifCountDua] = useState(0); // Contoh jumlah notifikasi
  const email = localStorage.getItem('email')
  const url = localStorage.getItem('role')

  useEffect(()=>{
    const fetchNotif = async () => {
        try{
            const res = await api.get('/api/listverifikasi/')
            setNotifCount(res.data.length)
        }catch(error){
            console.log("error fetching users")
        }
    }

    const fetchNotifdua = async () => {
        try{
            const res = await api.get('/api/pendatangverifikasi/')
            setNotifCountDua(res.data.length)
        }catch(error){
            console.log("error fetching users")
        }
    }

    fetchNotif();
    fetchNotifdua();
  },[])




  return (
    <div className="flex items-center gap-6 relative">

            {(url === "admin" || url === "kaling") && (
                <Link to={`/${url}/notivication`}>
                    <div className="relative cursor-pointer">
                        <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
                        {notifCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                                {notifCount + notifCountDua}
                            </span>
                        )}
                    </div>
                </Link>
            )}



        <div className="relative">
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
            <User className="w-7 h-7" />
            </button>

            {/* ⬇️ Dropdown Menu */}
            {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border p-4 z-50">
                <div className="pb-3 mb-3 border-b">
                <h4 className="font-semibold text-gray-800">{url}</h4>
                <p className="text-sm text-gray-500">{email}</p>
                </div>

                <ul className="space-y-2">
                <li>
                    <Link
                    to={`/${url}/profile`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                    >
                    <User size={16} /> View Profile
                    </Link>
                </li>
                <li>
                    <Link
                    to="/logout"
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                    <LogOut size={16} /> Logout
                    </Link>
                </li>
                </ul>
            </div>
            )}
        </div>
    </div>

    );
}

export default ProfileDrapdown;
