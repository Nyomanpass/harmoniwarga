import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";

function ResetPassword(){
    const { uid, token } = useParams()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            toast.error("Password tidak cocok, coba lagi")
            return;
        }

        const data = {
            uid: uid,
            token: token,
            new_password:password,
        }

        try{
            const response = await fetch("http://127.0.0.1:8000/password-reset-confirm/", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(data),
            })
            const result = await response.json()
            console.log("response:", result)
            if(!response.ok){
                throw new Error(result.message || "gagal reset password")
            }
            toast.success("Password berhasil direset")
            navigate("/login")
            setPassword("")
            setConfirmPassword("")
        }catch(error){
            console.log(error)
            toast.error(error.message)
        }

    }

    return(
        <>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-100 to-blue-100">
                <div className="bg-white px-8 py-10 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">🔐 Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                    <PasswordInput
                        label="Password Baru"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <div>
                    <PasswordInput
                        label="Konfirmasi Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </div>
                    <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2.5 rounded-lg font-semibold shadow-md"
                    >
                    Reset Password
                    </button>
                </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword