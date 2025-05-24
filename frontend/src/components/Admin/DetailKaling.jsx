import { useParams } from "react-router-dom";
import api from "../../api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function DetailKaling() {
    const { id } = useParams();
    const [kaling, setKaling] = useState({});
    const [loading, setLoading] = useState(false);
    const [statusKaling, setStatusKaling] = useState("");

    useEffect(() => {
        getKalingId();
    },[]);


    const getKalingId = async () => {
        try {
            const response = await api.get(`/dashboard/kaling/${id}/`);
            setKaling(response.data);
            setStatusKaling(response.data.status_kaling);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleStatusKaling = async () => {
        const newStatus = statusKaling === "aktif" ? "tidak_aktif" : "aktif";
        setLoading(true);
        try {
            const response = await api.patch(`/dashboard/updateStatusKaling/${id}/`, {
                status_kaling: newStatus,
            });
            getKalingId()
            setStatusKaling(response.data.status_kaling);
            toast.success('kaling staus di rubah')
        } catch (error) {
            console.log("Gagal update status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Detail Kaling </h1>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-10">
                <div className="divide-y">
                    <DetailItem label="Nama Lengkap" value={kaling.nama_lengkap} />
                    <DetailItem label="Nik" value={kaling.nik} />
                    <DetailItem label="Alamat" value={kaling.alamat} />
                    <DetailItem label="Email" value={kaling.email} />
                    <DetailItem label="Phone" value={kaling.phone} />
                    <div
                        className={`grid grid-cols-3 md:grid-cols-4 px-4 py-5 ${
                            statusKaling === "aktif" ? "bg-green-100" : "bg-red-100"
                        }`}
                        >
                        <div className="text-gray-600 font-medium">Status Kaling</div>
                        <div className="col-span-2 md:col-span-3 text-gray-900">
                            {statusKaling === "aktif" ? (
                            <span className="text-green-700 font-semibold">{statusKaling}</span>
                            ) : (
                            <span className="text-red-700 font-semibold">{statusKaling}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6 mt-7">
                <button
                    onClick={() => window.history.back()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                    Kembali
                </button>
                <button
                    onClick={toggleStatusKaling}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors duration-300 ${
                        statusKaling === "aktif"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    >
                    {loading
                        ? "Menyimpan..."
                        : statusKaling === "aktif"
                        ? "Nonaktifkan"
                        : "Aktifkan"}
                </button>

            </div>

            </div>
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 px-4 py-5 bg-white">
            <div className="text-gray-600 font-medium">{label}</div>
            <div className="col-span-2 md:col-span-3 text-gray-900">{value || "-"}</div>
        </div>
    );
}

export default DetailKaling;
