import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({
    damageReports,
    pagination,
    filters,
    stations,
}) {
    const [currentSearch, setCurrentSearch] = useState(filters.search || "");
    const [currentStasiun, setCurrentStasiun] = useState(filters.stasiun || "");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("damage-reports.index"),
            {
                search: currentSearch,
                stasiun: currentStasiun,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleFilterChange = (stasiun) => {
        router.get(
            route("damage-reports.index"),
            {
                search: currentSearch,
                stasiun: stasiun,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (
            confirm("Apakah Anda yakin ingin menghapus laporan kerusakan ini?")
        ) {
            router.delete(route("damage-reports.destroy", id));
        }
    };

    const handleViewImage = (imageUrl, reportNo) => {
        setSelectedImage({ url: imageUrl, reportNo: reportNo });
        setShowImageModal(true);
    };

    const handleDownloadImage = (imageUrl, reportNo) => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `damage-report-${reportNo}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Daftar Kerusakan
                </h2>
            }
        >
            <Head title="Daftar Kerusakan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with Add Button and Filter */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Daftar Laporan Kerusakan
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Kelola laporan kerusakan stasiun
                                        produksi
                                    </p>
                                </div>

                                <Link
                                    href={route("damage-reports.create")}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    + Tambah Laporan
                                </Link>
                            </div>

                            {/* Search and Filter */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <form
                                    onSubmit={handleSearch}
                                    className="md:col-span-2"
                                >
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Cari nomor, keterangan, atau catatan..."
                                            value={currentSearch}
                                            onChange={(e) =>
                                                setCurrentSearch(e.target.value)
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Cari
                                        </button>
                                        {(currentSearch || currentStasiun) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCurrentSearch("");
                                                    setCurrentStasiun("");
                                                    router.get(
                                                        route(
                                                            "damage-reports.index"
                                                        )
                                                    );
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <select
                                    value={currentStasiun}
                                    onChange={(e) => {
                                        setCurrentStasiun(e.target.value);
                                        handleFilterChange(e.target.value);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Semua Stasiun</option>
                                    {Object.entries(stations).map(
                                        ([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Results Info */}
                            {pagination.total > 0 && (
                                <div className="mb-4 text-sm text-gray-600">
                                    Menampilkan {pagination.from} -{" "}
                                    {pagination.to} dari {pagination.total}{" "}
                                    laporan
                                </div>
                            )}

                            {/* Table */}
                            {damageReports.data &&
                            damageReports.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stasiun
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Keterangan Kerusakan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Detail
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Gambar
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {damageReports.data.map(
                                                (report, index) => (
                                                    <tr
                                                        key={report.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {report.no}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {
                                                                    report.formatted_stasiun
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                                {
                                                                    report.keterangan_kerusakan
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                {report.catatan && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                        📝
                                                                        Catatan
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                {report.gambar ? (
                                                                    <>
                                                                        <img
                                                                            src={
                                                                                report.gambar
                                                                            }
                                                                            alt={`Gambar ${report.no}`}
                                                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                                                            onClick={() =>
                                                                                handleViewImage(
                                                                                    report.gambar,
                                                                                    report.no
                                                                                )
                                                                            }
                                                                        />
                                                                        <div className="flex flex-col space-y-1">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleViewImage(
                                                                                        report.gambar,
                                                                                        report.no
                                                                                    )
                                                                                }
                                                                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                                            >
                                                                                Lihat
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDownloadImage(
                                                                                        report.gambar,
                                                                                        report.no
                                                                                    )
                                                                                }
                                                                                className="text-green-600 hover:text-green-800 text-xs font-medium"
                                                                            >
                                                                                Download
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">
                                                                        Tidak
                                                                        ada
                                                                        gambar
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                <div className="font-medium">
                                                                    {new Date(
                                                                        report.created_at
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                        {
                                                                            year: "numeric",
                                                                            month: "2-digit",
                                                                            day: "2-digit",
                                                                            timeZone:
                                                                                "Asia/Jakarta",
                                                                        }
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {new Date(
                                                                        report.created_at
                                                                    ).toLocaleTimeString(
                                                                        "id-ID",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            second: "2-digit",
                                                                            hour12: false,
                                                                            timeZone:
                                                                                "Asia/Jakarta",
                                                                        }
                                                                    )}{" "}
                                                                    WIB
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={route(
                                                                        "damage-reports.show",
                                                                        report.id
                                                                    )}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    Detail
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "damage-reports.edit",
                                                                        report.id
                                                                    )}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            report.id
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg mb-4">
                                        {currentSearch || currentStasiun
                                            ? "Tidak ada laporan kerusakan yang cocok dengan filter."
                                            : "Belum ada laporan kerusakan."}
                                    </div>
                                    {/* <Link
                                        href={route("damage-reports.create")}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Tambah Laporan Pertama
                                    </Link> */}
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        {pagination.current_page > 1 && (
                                            <Link
                                                href={route(
                                                    "damage-reports.index",
                                                    {
                                                        page:
                                                            pagination.current_page -
                                                            1,
                                                        search: currentSearch,
                                                        stasiun: currentStasiun,
                                                    }
                                                )}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {pagination.current_page <
                                            pagination.last_page && (
                                            <Link
                                                href={route(
                                                    "damage-reports.index",
                                                    {
                                                        page:
                                                            pagination.current_page +
                                                            1,
                                                        search: currentSearch,
                                                        stasiun: currentStasiun,
                                                    }
                                                )}
                                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Halaman{" "}
                                                <span className="font-medium">
                                                    {pagination.current_page}
                                                </span>{" "}
                                                dari{" "}
                                                <span className="font-medium">
                                                    {pagination.last_page}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav
                                                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                                aria-label="Pagination"
                                            >
                                                {pagination.current_page >
                                                    1 && (
                                                    <Link
                                                        href={route(
                                                            "damage-reports.index",
                                                            {
                                                                page:
                                                                    pagination.current_page -
                                                                    1,
                                                                search: currentSearch,
                                                                stasiun:
                                                                    currentStasiun,
                                                            }
                                                        )}
                                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                    >
                                                        <span className="sr-only">
                                                            Previous
                                                        </span>
                                                        ‹
                                                    </Link>
                                                )}

                                                {/* Page numbers */}
                                                {Array.from(
                                                    {
                                                        length: Math.min(
                                                            5,
                                                            pagination.last_page
                                                        ),
                                                    },
                                                    (_, i) => {
                                                        const page =
                                                            Math.max(
                                                                1,
                                                                pagination.current_page -
                                                                    2
                                                            ) + i;
                                                        if (
                                                            page >
                                                            pagination.last_page
                                                        )
                                                            return null;

                                                        return (
                                                            <Link
                                                                key={page}
                                                                href={route(
                                                                    "damage-reports.index",
                                                                    {
                                                                        page: page,
                                                                        search: currentSearch,
                                                                        stasiun:
                                                                            currentStasiun,
                                                                    }
                                                                )}
                                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                                    page ===
                                                                    pagination.current_page
                                                                        ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                                }`}
                                                            >
                                                                {page}
                                                            </Link>
                                                        );
                                                    }
                                                )}

                                                {pagination.current_page <
                                                    pagination.last_page && (
                                                    <Link
                                                        href={route(
                                                            "damage-reports.index",
                                                            {
                                                                page:
                                                                    pagination.current_page +
                                                                    1,
                                                                search: currentSearch,
                                                                stasiun:
                                                                    currentStasiun,
                                                            }
                                                        )}
                                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                    >
                                                        <span className="sr-only">
                                                            Next
                                                        </span>
                                                        ›
                                                    </Link>
                                                )}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {showImageModal && selectedImage && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowImageModal(false)}
                        ></div>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => setShowImageModal(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <h3
                                        className="text-lg leading-6 font-medium text-gray-900 mb-4"
                                        id="modal-title"
                                    >
                                        Gambar Kerusakan -{" "}
                                        {selectedImage.reportNo}
                                    </h3>
                                    <div className="mt-2">
                                        <img
                                            src={selectedImage.url}
                                            alt={`Gambar ${selectedImage.reportNo}`}
                                            className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                                            style={{ maxHeight: "70vh" }}
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-center space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            onClick={() =>
                                                handleDownloadImage(
                                                    selectedImage.url,
                                                    selectedImage.reportNo
                                                )
                                            }
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
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                                ></path>
                                            </svg>
                                            Download Gambar
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            onClick={() =>
                                                setShowImageModal(false)
                                            }
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
