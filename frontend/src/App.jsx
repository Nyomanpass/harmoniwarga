import './App.css'
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import file page
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard';
import ConfirmPassword from './pages/ConfirmPassword';
import ResetPassword from './pages/ResetPassword';

//import file component
import ProtectedRoute from './components/ProtectedRoute';
import Notivication from './components/Notivication';

//import admin file
import MainAdmin from './components/Admin/MainAdmin';
import AdminKaling from './components/Admin/AdminKaling';
import AdminPenanggungjawab from './components/Admin/AdminPenanggungjawab';
import AdminPendatang from './components/Admin/AdminPendatang';
import DetailKaling from './components/Admin/DetailKaling';

//import klaing file
import DetailPenanggungjawab from './components/kaling/DetailPenanggungjawab';

// impot penanggung jawab file
import MainPenanggungjawab from './components/penanggungjawab/MainPenanggungjawab';
import MainPendatang from './components/penanggungjawab/MainPendatang';
import DetailPendatang from './components/penanggungjawab/DetailPendatang';
import AddAndUpdatePendatang from './components/penanggungjawab/AddAndUpdatePendatang';

//import components
import Profile from './components/Profile'



function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {

  return (
    <>
      <Router>
        <Routes>

          {/* route untuk admin */}
          <Route path='/admin/*' element={<ProtectedRoute allowedRoles={['admin']}><Dashboard/></ProtectedRoute>}>
            <Route index element={<MainAdmin/>} />
            <Route path="profile" element={<Profile/>} />
            <Route path="notivication" element={<Notivication/>}/>
            <Route path="data-kaling" element={<AdminKaling/>}/>
            <Route path="data-penanggungjawab" element={<AdminPenanggungjawab/>}/>
            <Route path="data-pendatang" element={<AdminPendatang/>}/>
            <Route path="detail/pendatang/:id/" element={<DetailPendatang/>}/>
            <Route path="detail/penanggungjawab/:id/" element={<DetailPenanggungjawab/>}/>
            <Route path="detail/kaling/:id/" element={<DetailKaling/>}/>
          </Route>

          {/* route unutk kaling */}
          <Route path='/kaling/*' element={<ProtectedRoute allowedRoles={['kaling']}><Dashboard/></ProtectedRoute>}>
            <Route index element={<MainAdmin/>} />
            <Route path="profile" element={<Profile/>} />
            <Route path="notivication" element={<Notivication/>}/>
            <Route path="data-penanggungjawab" element={<AdminPenanggungjawab/>}/>
            <Route path="data-pendatang" element={<AdminPendatang/>}/>
            <Route path="detail/pendatang/:id/" element={<DetailPendatang/>}/>
            <Route path="detail/penanggungjawab/:id/" element={<DetailPenanggungjawab/>}/>
          </Route>

          <Route path='/penanggungjawab/*' element={<ProtectedRoute allowedRoles={['penanggungjawab']}><Dashboard/></ProtectedRoute>}>
            <Route index element={<MainPenanggungjawab/>} />
            <Route path="profile" element={<Profile/>} />
            <Route path="data-pendatang" element={<MainPendatang/>}/>
            <Route path="detail/pendatang/:id/" element={<DetailPendatang/>}/>
            <Route path="pendatang/" element={<AddAndUpdatePendatang/>}/>
            <Route path="pendatang/edit/:id" element={<AddAndUpdatePendatang isEdit="edit" />} />
          </Route>

          {/* semua root allownay */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<RegisterAndLogout/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/reset-password" element={<ConfirmPassword/>}/>
          <Route path="/reset-password/:uid/:token" element={<ResetPassword/>}/>

        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
