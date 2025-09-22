import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Show({ damageReport }) {
    const handleDelete = () => {
        if (
            confirm("Apakah Anda yakin ingin menghapus laporan kerusakan ini?")
        ) {
            router.delete(route("damage-reports.destroy", damageReport.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Laporan Kerusakan
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route("damage-reports.edit", damageReport.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Laporan ${damageReport.no}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Laporan #{damageReport.no}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        Dibuat pada{" "}
                                        {new Date(
                                            damageReport.created_at
                                        ).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {damageReport.formatted_stasiun}
                                </span>
                            </div>

                            <Link
                                href={route("damage-reports.index")}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Kembali ke Daftar Kerusakan
                            </Link>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Information Section */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                            Informasi Kerusakan
                                        </h4>

                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Nomor Laporan
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                                                    {damageReport.no}
                                                </dd>
                                            </div>

                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Stasiun
                                                </dt>
                                                <dd className="mt-1">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {
                                                            damageReport.formatted_stasiun
                                                        }
                                                    </span>
                                                </dd>
                                            </div>

                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Tanggal Laporan
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date(
                                                        damageReport.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </dd>
                                            </div>

                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Terakhir Diupdate
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date(
                                                        damageReport.updated_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                            Keterangan Kerusakan
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900 whitespace-pre-wrap">
                                                {
                                                    damageReport.keterangan_kerusakan
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {damageReport.catatan && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                                Catatan Detail
                                            </h4>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <p className="text-gray-900 whitespace-pre-wrap">
                                                    {damageReport.catatan}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Image Section */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Dokumentasi
                                    </h4>
                                    {damageReport.gambar ? (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="aspect-w-16 aspect-h-12">
                                                <img
                                                    src={damageReport.gambar}
                                                    alt={`Foto kerusakan ${damageReport.no}`}
                                                    className="object-cover rounded-lg shadow-lg w-full h-auto max-h-96"
                                                />
                                            </div>
                                            <div className="mt-4 flex justify-center">
                                                <a
                                                    href={damageReport.gambar}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                    Lihat Ukuran Penuh
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                                            <svg
                                                className="mx-auto h-16 w-16 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <p className="mt-4 text-gray-500">
                                                Tidak ada dokumentasi foto
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route("damage-reports.index")}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors"
                                    >
                                        Kembali
                                    </Link>
                                    <Link
                                        href={route(
                                            "damage-reports.edit",
                                            damageReport.id
                                        )}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                                    >
                                        Edit Laporan
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                                    >
                                        Hapus Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
