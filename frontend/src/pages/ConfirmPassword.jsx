import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ConfirmPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log("response:", result);

      if (!response.ok) {
        throw new Error(result.email || "Gagal mengirim email reset password");
      }

      toast.success("Link reset password telah dikirim ke email Anda");
      setEmail("");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transition-all">
        <div className="text-center mb-6">
          <div className="text-4xl">🔐</div>
          <h2 className="text-2xl font-bold mt-2">Reset Password</h2>
          <p className="text-gray-600 text-sm mt-1">
            Masukkan email Anda dan kami akan mengirim link reset.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Anda
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
          >
            Kirim Link Reset
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a
            href="/login"
            className="text-blue-500 hover:underline transition duration-200"
          >
            Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPassword;
