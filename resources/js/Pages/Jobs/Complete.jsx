import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function CompleteJob({ job }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        completion_note: job.completion_note || "",
        completion_image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [isResubmit, setIsResubmit] = useState(job.status === "Rejected");
    const [isAsistenBengkel] = useState(user.role === "asisten_bengkel");

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/jobs/${job.id}/submit-completion`);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("completion_image", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            Proses: {
                color: "bg-blue-100 text-blue-800",
                text: "Sedang Dikerjakan",
            },
            Rejected: {
                color: "bg-red-100 text-red-800",
                text: "Ditolak - Perlu Perbaikan",
            },
        };

        const config = statusConfig[status] || {
            color: "bg-gray-100 text-gray-800",
            text: status,
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {isResubmit
                        ? "Submit Ulang Pekerjaan"
                        : isAsistenBengkel
                        ? "Selesaikan Pekerjaan (Asisten Bengkel)"
                        : "Selesaikan Pekerjaan"}
                </h2>
            }
        >
            <Head
                title={
                    isResubmit
                        ? "Submit Ulang Pekerjaan"
                        : "Selesaikan Pekerjaan"
                }
            />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Job Info Card */}
                    <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {job.nama_pekerjaan}
                                    </h3>
                                    <p className="text-gray-600">
                                        Mekanik: {job.mekanik}
                                    </p>
                                    <p className="text-gray-600">
                                        Estimasi: {job.estimasi_menit} menit
                                    </p>
                                </div>
                                <div>{getStatusBadge(job.status)}</div>
                            </div>

                            {job.status === "Rejected" && job.reject_reason && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <h4 className="text-red-800 font-medium mb-2">
                                        Alasan Penolakan:
                                    </h4>
                                    <p className="text-red-700">
                                        {job.reject_reason}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Completion Form */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    {isResubmit
                                        ? "Perbaiki dan Submit Ulang"
                                        : "Detail Penyelesaian Pekerjaan"}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {isAsistenBengkel
                                        ? "Sebagai asisten bengkel, setelah submit pekerjaan akan langsung di-approve otomatis."
                                        : "Silakan isi catatan detail dan upload foto bukti penyelesaian pekerjaan"}
                                </p>
                                {isAsistenBengkel && (
                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                        <p className="text-sm text-blue-800">
                                            <strong>
                                                Info Asisten Bengkel:
                                            </strong>{" "}
                                            Pekerjaan ini akan langsung
                                            berstatus "Selesai" setelah Anda
                                            submit.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Completion Note */}
                                <div>
                                    <label
                                        htmlFor="completion_note"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Catatan Penyelesaian{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="completion_note"
                                        rows={6}
                                        value={data.completion_note}
                                        onChange={(e) =>
                                            setData(
                                                "completion_note",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Deskripsikan detail pekerjaan yang telah diselesaikan, termasuk:
- Komponen yang diperbaiki/diganti
- Proses yang dilakukan  
- Kondisi akhir
- Catatan khusus lainnya

Minimal 10 karakter..."
                                    />
                                    {errors.completion_note && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.completion_note}
                                        </p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label
                                        htmlFor="completion_image"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Foto Bukti Penyelesaian{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="completion_image"
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                        >
                                            {imagePreview ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                        <p className="text-white text-sm">
                                                            Klik untuk mengganti
                                                            gambar
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className="w-8 h-8 mb-4 text-gray-500"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 20 16"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                        />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">
                                                            Klik untuk upload
                                                        </span>{" "}
                                                        foto bukti
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, JPEG (MAX.
                                                        2MB)
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                id="completion_image"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                    {errors.completion_image && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.completion_image}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        Upload foto yang jelas menunjukkan hasil
                                        pekerjaan yang telah selesai
                                    </p>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                {isResubmit
                                                    ? "Mengirim Ulang..."
                                                    : isAsistenBengkel
                                                    ? "Memproses & Approve..."
                                                    : "Mengirim..."}
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    ></path>
                                                </svg>
                                                {isResubmit
                                                    ? "Submit Ulang"
                                                    : isAsistenBengkel
                                                    ? "Selesaikan & Auto-Approve"
                                                    : "Selesaikan Pekerjaan"}
                                            </>
                                        )}
                                    </button>
                                    <a
                                        href="/jobs"
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 inline-flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                        </svg>
                                        Batal
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
