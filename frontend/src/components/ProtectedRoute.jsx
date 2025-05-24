import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant";
import { useState, useEffect } from 'react'

function ProtectedRoute({children, allowedRoles}){
    const [isAuthorization, setIsAuthorization] = useState(null)
    const [userRole, setUserRole] = useState(null)

    useEffect(()=>{
        auth().catch(()=>setIsAuthorization(false))
    },[])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            const res = await api.post('/api/refresh/', {
                refresh:refreshToken
            })
            if(res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorization(true)
            }else{
                setIsAuthorization(false)
            }
        }catch(error){
            console.log(error)
            setIsAuthorization(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAuthorization(false)
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if(tokenExpiration < now){
            await refreshToken()
        }else{
            setUserRole(localStorage.getItem('role'))
            setIsAuthorization(true)
        }

    }

    if(isAuthorization == null){
        return <div>loading...</div>
    }

    if(!isAuthorization){
        return <Navigate to='/login'/>
    }

    if(userRole === 'admin' && !allowedRoles.includes("admin")){
        return <Navigate to="/admin"/>
    }else if(userRole === 'kaling' && !allowedRoles.includes("kaling")){
        return <Navigate to="/kaling"/>
    }else if(userRole === 'penanggungjawab' && !allowedRoles.includes("penanggungjawab")){
        return <Navigate to="/penanggungjawab"/>
    }

    return children


}

export default ProtectedRoute