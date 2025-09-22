import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function ShowJob({ job }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

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

    const getRemainingTime = () => {
        if (!job.waktu_mulai || job.status === "Selesai") return 0;

        const startTime = new Date(job.waktu_mulai);
        const endTime = new Date(
            startTime.getTime() + job.estimasi_menit * 60000
        );
        const now = currentTime;

        if (now > endTime) return 0;

        return Math.ceil((endTime - now) / 60000);
    };

    const getProgressPercentage = () => {
        if (!job.waktu_mulai || job.estimasi_menit <= 0) return 0;

        const startTime = new Date(job.waktu_mulai);
        const now = currentTime;
        const elapsedMinutes = (now - startTime) / 60000;
        const progress = (elapsedMinutes / job.estimasi_menit) * 100;

        return Math.min(100, Math.max(0, progress));
    };

    const handleStart = () => {
        router.patch(`/jobs/${job.id}/start`);
    };

    const handleComplete = () => {
        router.patch(`/jobs/${job.id}/complete`);
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

    const handleApprove = () => {
        router.patch(`/jobs/${job.id}/approve`);
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            alert("Alasan penolakan harus diisi!");
            return;
        }
        router.patch(`/jobs/${job.id}/reject`, {
            reject_reason: rejectReason,
        });
        setShowRejectModal(false);
        setRejectReason("");
    };

    const remainingTime = getRemainingTime();
    const progress = getProgressPercentage();
    const isOverdue = remainingTime <= 0 && job.status === "Proses";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detail Pekerjaan: {job.nama_pekerjaan}
                </h2>
            }
        >
            <Head title={`Detail Pekerjaan: ${job.nama_pekerjaan}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {job.nama_pekerjaan}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded text-sm text-white ${getStatusColor(
                                            job.status
                                        )}`}
                                    >
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {/* Only Asisten Bengkel can Edit */}
                                    {user.role === "asisten_bengkel" &&
                                        job.status !== "Selesai" && (
                                            <a
                                                href={`/jobs/${job.id}/edit`}
                                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Edit
                                            </a>
                                        )}
                                    <a
                                        href="/jobs"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Kembali
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Informasi Pekerjaan
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Nama Mekanik
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {job.mekanik}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Estimasi Waktu
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {job.estimasi_menit} menit
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Waktu Mulai
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {job.waktu_mulai
                                                    ? new Date(
                                                          job.waktu_mulai
                                                      ).toLocaleString("id-ID")
                                                    : "Belum dimulai"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Dibuat Pada
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(
                                                    job.created_at
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Progress Pekerjaan
                                    </h4>

                                    {job.status === "Proses" && (
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>Sisa Waktu:</span>
                                                    <span
                                                        className={`font-mono text-lg ${
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
                                                <div className="w-full bg-gray-200 rounded-full h-4">
                                                    <div
                                                        className={`h-4 rounded-full transition-all duration-1000 ${
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
                                                <div className="text-sm text-gray-600 mt-2">
                                                    Progress:{" "}
                                                    {Math.round(progress)}%
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {job.status === "Belum Mulai" && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">
                                                Pekerjaan belum dimulai
                                            </p>
                                        </div>
                                    )}

                                    {job.status === "Waiting" && (
                                        <div className="text-center py-8">
                                            <p className="text-yellow-600 font-medium">
                                                ⏳ Menunggu approval management
                                            </p>
                                        </div>
                                    )}

                                    {job.status === "Selesai" && (
                                        <div className="text-center py-8">
                                            <p className="text-green-600 font-medium">
                                                ✓ Pekerjaan telah selesai
                                            </p>
                                        </div>
                                    )}

                                    {job.status === "Rejected" && (
                                        <div className="text-center py-8">
                                            <p className="text-red-600 font-medium">
                                                ❌ Pekerjaan ditolak, perlu
                                                perbaikan
                                            </p>
                                        </div>
                                    )}

                                    {job.status === "Lewat Waktu" && (
                                        <div className="text-center py-8">
                                            <p className="text-red-600 font-medium">
                                                ⚠ Pekerjaan lewat waktu
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Completion Details */}
                            {(job.status === "Waiting" ||
                                job.status === "Selesai" ||
                                job.status === "Rejected") &&
                                job.completion_note && (
                                    <div className="border-t pt-6 mb-6">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                                            Detail Penyelesaian
                                        </h4>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Catatan Penyelesaian
                                                </label>
                                                <div className="bg-gray-50 p-4 rounded-md">
                                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                                        {job.completion_note}
                                                    </p>
                                                </div>
                                                <div className="mt-3 space-y-1">
                                                    <p className="text-xs text-gray-500">
                                                        Diselesaikan oleh:{" "}
                                                        <span className="font-medium">
                                                            {
                                                                job.completed_by
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Waktu submit:{" "}
                                                        {job.submitted_at
                                                            ? new Date(
                                                                  job.submitted_at
                                                              ).toLocaleString(
                                                                  "id-ID"
                                                              )
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Foto Bukti
                                                </label>
                                                {job.completion_image && (
                                                    <div className="bg-gray-50 p-4 rounded-md">
                                                        <img
                                                            src={
                                                                job.completion_image
                                                            }
                                                            alt="Bukti penyelesaian"
                                                            className="w-full h-64 object-cover rounded-md mb-3"
                                                        />
                                                        <a
                                                            href={route(
                                                                "jobs.download-image",
                                                                job.id
                                                            )}
                                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                            download
                                                        >
                                                            <svg
                                                                className="w-4 h-4 mr-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                ></path>
                                                            </svg>
                                                            Download Foto
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Review Details */}
                                        {job.reviewed_at && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-md">
                                                <h5 className="font-medium text-blue-900 mb-2">
                                                    Status Review
                                                </h5>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-blue-800">
                                                        Direview oleh:{" "}
                                                        <span className="font-medium">
                                                            {
                                                                job.reviewed_by
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-blue-800">
                                                        Waktu review:{" "}
                                                        {new Date(
                                                            job.reviewed_at
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>
                                                    {job.status ===
                                                        "Rejected" &&
                                                        job.reject_reason && (
                                                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                                                <p className="text-sm font-medium text-red-800">
                                                                    Alasan
                                                                    Penolakan:
                                                                </p>
                                                                <p className="text-sm text-red-700 mt-1">
                                                                    {
                                                                        job.reject_reason
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            {/* Action Buttons */}
                            <div className="border-t pt-6">
                                <div className="flex gap-4 flex-wrap">
                                    {/* Asisten Bengkel Actions */}
                                    {user.role === "asisten_bengkel" && (
                                        <>
                                            {job.status === "Belum Mulai" && (
                                                <button
                                                    onClick={handleStart}
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Mulai Pekerjaan
                                                </button>
                                            )}
                                            {(job.status === "Proses" ||
                                                job.status ===
                                                    "Lewat Waktu") && (
                                                <a
                                                    href={`/jobs/${job.id}/complete-form`}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    ✓ Selesaikan Pekerjaan
                                                </a>
                                            )}
                                        </>
                                    )}

                                    {/* Management Approval Actions - Manager, Askep, Asisten Bengkel */}
                                    {(user.role === "manager" ||
                                        user.role === "askep" ||
                                        user.role === "asisten_bengkel") && (
                                        <>
                                            {job.is_waiting_approval && (
                                                <>
                                                    <button
                                                        onClick={handleApprove}
                                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        ✓ Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setShowRejectModal(
                                                                true
                                                            )
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        ✗ Reject
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {/* Karyawan Actions */}
                                    {user.role === "karyawan" && (
                                        <>
                                            {(job.can_be_completed ||
                                                job.can_be_resubmitted) &&
                                                job.can_be_accessed_by_current_user && (
                                                    <a
                                                        href={`/jobs/${job.id}/complete-form`}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        {job.can_be_resubmitted
                                                            ? "Submit Ulang"
                                                            : "Selesaikan Pekerjaan"}
                                                    </a>
                                                )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Reject Modal */}
                            {showRejectModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Reject Pekerjaan
                                        </h3>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Alasan Penolakan{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={rejectReason}
                                                onChange={(e) =>
                                                    setRejectReason(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                                placeholder="Jelaskan alasan penolakan dan apa yang perlu diperbaiki..."
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleReject}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowRejectModal(false);
                                                    setRejectReason("");
                                                }}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
