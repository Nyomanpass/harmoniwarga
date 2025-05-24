import { Eye, EyeOff } from "lucide-react"; 
import { useState } from "react"

function PasswordInput({value, onChange, label}){
    const [showPassword ,setShowPassword] = useState(false)

    return (
        <>
        <div className="relative">
            <label className="block text-gray-600 text-sm mb-1">{label}</label>
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={`Masukkan ${label.toLowerCase()}`}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
        </>
    )
}

export default PasswordInput