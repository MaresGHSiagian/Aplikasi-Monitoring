import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Dashboard({
    jobs = [],
    completedJobs = [],
    stats = {},
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (minutes) => {
        if (minutes <= 0) return "00:00";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}`;
    };

    const getRemainingTime = (job) => {
        if (!job.waktu_mulai || job.status === "Selesai") return 0;

        const startTime = new Date(job.waktu_mulai);
        const endTime = new Date(
            startTime.getTime() + job.estimasi_menit * 60000
        );
        const now = currentTime;

        if (now > endTime) return 0;

        return Math.ceil((endTime - now) / 60000);
    };

    const getProgressPercentage = (job) => {
        if (!job.waktu_mulai || job.estimasi_menit <= 0) return 0;

        const startTime = new Date(job.waktu_mulai);
        const now = currentTime;
        const elapsedMinutes = (now - startTime) / 60000;
        const progress = (elapsedMinutes / job.estimasi_menit) * 100;

        return Math.min(100, Math.max(0, progress));
    };

    const handleStart = (jobId) => {
        router.patch(`/jobs/${jobId}/start`);
    };

    const handleComplete = (jobId) => {
        router.patch(`/jobs/${jobId}/complete`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Belum Mulai":
                return "bg-gray-500";
            case "Proses":
                return "bg-blue-500";
            case "Waiting":
                return "bg-yellow-500";
            case "Selesai":
                return "bg-green-500";
            case "Rejected":
                return "bg-red-500";
            case "Lewat Waktu":
                return "bg-red-600";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard - Monitor Pekerjaan Bengkel
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.total || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Total Pekerjaan
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-2xl font-bold text-gray-600">
                                    {stats.belum_mulai || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Belum Mulai
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.proses || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Sedang Proses
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {stats.waiting || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Menunggu Approve
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.selesai || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Selesai
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.rejected || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Ditolak
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.lewat_waktu || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Lewat Waktu
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Pekerjaan Aktif
                                </h3>
                                {user.role === "asisten_bengkel" && (
                                    <a
                                        href="/jobs/create"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Tambah Job Karyawan
                                    </a>
                                )}
                            </div>

                            {jobs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        Belum ada pekerjaan aktif
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {jobs.map((job) => {
                                        const remainingTime =
                                            getRemainingTime(job);
                                        const progress =
                                            getProgressPercentage(job);
                                        const isOverdue =
                                            remainingTime <= 0 &&
                                            job.status === "Proses";

                                        return (
                                            <div
                                                key={job.id}
                                                className={`border rounded-lg p-4 ${
                                                    isOverdue
                                                        ? "border-red-500 bg-red-50"
                                                        : "border-gray-200"
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {job.nama_pekerjaan}
                                                    </h4>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
                                                            job.status
                                                        )}`}
                                                    >
                                                        {job.status}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-2">
                                                    Mekanik: {job.mekanik}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Estimasi:{" "}
                                                    {job.estimasi_menit} menit
                                                </p>

                                                {/* Timer and Progress */}
                                                {job.status === "Proses" && (
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span>
                                                                Sisa Waktu:
                                                            </span>
                                                            <span
                                                                className={`font-mono ${
                                                                    isOverdue
                                                                        ? "text-red-600"
                                                                        : "text-blue-600"
                                                                }`}
                                                            >
                                                                {isOverdue
                                                                    ? "LEWAT WAKTU"
                                                                    : formatTime(
                                                                          remainingTime
                                                                      )}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-1000 ${
                                                                    isOverdue
                                                                        ? "bg-red-500"
                                                                        : "bg-blue-500"
                                                                }`}
                                                                style={{
                                                                    width: `${Math.min(
                                                                        100,
                                                                        progress
                                                                    )}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Progress:{" "}
                                                            {Math.round(
                                                                progress
                                                            )}
                                                            %
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    {/* HANYA ASISTEN BENGKEL YANG BISA MULAI PEKERJAAN KARYAWAN */}
                                                    {job.status ===
                                                        "Belum Mulai" &&
                                                        user.role ===
                                                            "asisten_bengkel" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleStart(
                                                                        job.id
                                                                    )
                                                                }
                                                                className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-3 rounded"
                                                            >
                                                                Mulai
                                                            </button>
                                                        )}
                                                    {/* Tombol Complete dengan logic per role */}
                                                    {(job.status === "Proses" ||
                                                        job.status ===
                                                            "Lewat Waktu") && (
                                                        <>
                                                            {/* Hanya asisten bengkel yang bisa complete semua job */}
                                                            {user.role ===
                                                                "asisten_bengkel" && (
                                                                <a
                                                                    href={`/jobs/${job.id}/complete-form`}
                                                                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                                                                >
                                                                    Selesai
                                                                </a>
                                                            )}
                                                            {/* Karyawan hanya bisa complete job mereka sendiri */}
                                                            {user.role ===
                                                                "karyawan" &&
                                                                job.mekanik ===
                                                                    user.name && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleComplete(
                                                                                job.id
                                                                            )
                                                                        }
                                                                        className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                                                                    >
                                                                        Selesai
                                                                    </button>
                                                                )}
                                                        </>
                                                    )}
                                                    <a
                                                        href={`/jobs/${job.id}`}
                                                        className="bg-gray-500 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded"
                                                    >
                                                        Detail
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Completed Jobs Section */}
                    {completedJobs.length > 0 && (
                        <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Pekerjaan Selesai Terbaru
                                    </h3>
                                    <a
                                        href="/jobs?status=Selesai"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Lihat Semua
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {completedJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="border border-green-200 rounded-lg p-4 bg-green-50"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-900">
                                                    {job.nama_pekerjaan}
                                                </h4>
                                                <span className="px-2 py-1 rounded text-xs text-white bg-green-500">
                                                    Selesai
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-2">
                                                Mekanik: {job.mekanik}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Estimasi: {job.estimasi_menit}{" "}
                                                menit
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Diselesaikan:{" "}
                                                {new Date(
                                                    job.updated_at
                                                ).toLocaleDateString("id-ID", {
                                                    weekday: "short",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>

                                            <div className="mt-3 flex gap-2">
                                                <a
                                                    href={`/jobs/${job.id}`}
                                                    className="bg-gray-500 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded"
                                                >
                                                    Detail
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
