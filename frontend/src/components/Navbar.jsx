import { Menu, Search } from "lucide-react";
import ProfileDrapdown from "./ProfileDrapdown";

function  Navbar({toggleSidebar}){
    const username = localStorage.getItem('username');

    
  return (
    <header className="mx-6 flex px-4 items-center z-10 justify-between  bg-white shadow py-3">
      {/* Kiri: Logo dan Menu */}
      <div className="flex items-center gap-3" onClick={toggleSidebar}>
        <Menu className="w-6 md:hidden h-6 cursor-pointer" />
        <h1 className="text-xl">{localStorage.getItem('role')}</h1>
      </div>     

      {/* Kanan: Notifikasi & Profil */}
      <div className="flex items-center gap-5">
        <div className="flex md:hidden items-center bg-gray-100 rounded-lg px-4 py-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent outline-none pl-2 "
          />
        </div>
        <ProfileDrapdown/>
      </div>
    </header>
  );
};

export default Navbar;
