import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Dropdown from "@/Components/Dropdown";

export default function JobsIndex({ jobs = [], filters = {}, stats = {} }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const handleFilterChange = (status) => {
        if (status === "") {
            // Clear filter - go to jobs without any parameters
            router.visit("/jobs");
        } else {
            // Apply filter
            router.visit(`/jobs?status=${encodeURIComponent(status)}`);
        }
    };

    const currentStatus = filters.status || "";

    const handleDelete = (jobId) => {
        if (confirm("Apakah Anda yakin ingin menghapus pekerjaan ini?")) {
            router.delete(`/jobs/${jobId}`);
        }
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Daftar Pekerjaan
                </h2>
            }
        >
            <Head title="Daftar Pekerjaan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with Add Button and Filter */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Daftar Pekerjaan
                                        {currentStatus && (
                                            <span className="ml-2 text-sm text-gray-500">
                                                - Filter: {currentStatus}
                                            </span>
                                        )}
                                    </h3>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    {/* Status Filter Dropdown */}
                                    <div className="relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[200px]">
                                                    {currentStatus === "" ? (
                                                        <span className="flex items-center gap-2">
                                                            Semua Status
                                                            {stats.total !==
                                                                undefined && (
                                                                <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                                                                    {
                                                                        stats.total
                                                                    }
                                                                </span>
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            {currentStatus}
                                                            {currentStatus ===
                                                                "Belum Mulai" &&
                                                                stats.belum_mulai !==
                                                                    undefined && (
                                                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                                                                        {
                                                                            stats.belum_mulai
                                                                        }
                                                                    </span>
                                                                )}
                                                            {currentStatus ===
                                                                "Proses" &&
                                                                stats.proses !==
                                                                    undefined && (
                                                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-600">
                                                                        {
                                                                            stats.proses
                                                                        }
                                                                    </span>
                                                                )}
                                                            {currentStatus ===
                                                                "Waiting" &&
                                                                stats.waiting !==
                                                                    undefined && (
                                                                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-200 text-yellow-600">
                                                                        {
                                                                            stats.waiting
                                                                        }
                                                                    </span>
                                                                )}
                                                            {currentStatus ===
                                                                "Selesai" &&
                                                                stats.selesai !==
                                                                    undefined && (
                                                                    <span className="px-2 py-1 rounded-full text-xs bg-green-200 text-green-600">
                                                                        {
                                                                            stats.selesai
                                                                        }
                                                                    </span>
                                                                )}
                                                            {currentStatus ===
                                                                "Rejected" &&
                                                                stats.rejected !==
                                                                    undefined && (
                                                                    <span className="px-2 py-1 rounded-full text-xs bg-red-200 text-red-600">
                                                                        {
                                                                            stats.rejected
                                                                        }
                                                                    </span>
                                                                )}
                                                            {currentStatus ===
                                                                "Lewat Waktu" &&
                                                                stats.lewat_waktu !==
                                                                    undefined && (
                                                                    <span className="px-2 py-1 rounded-full text-xs bg-red-200 text-red-600">
                                                                        {
                                                                            stats.lewat_waktu
                                                                        }
                                                                    </span>
                                                                )}
                                                        </span>
                                                    )}
                                                    <svg
                                                        className="-mr-1 ml-2 h-5 w-5"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content
                                                align="left"
                                                width="48"
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                ""
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                                            currentStatus === ""
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span>
                                                            Semua Status
                                                        </span>
                                                        {stats.total !==
                                                            undefined && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                                                                {stats.total}
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "Belum Mulai"
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                                            currentStatus ===
                                                            "Belum Mulai"
                                                                ? "bg-gray-50 text-gray-700"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span>Belum Mulai</span>
                                                        {stats.belum_mulai !==
                                                            undefined && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                                                                {
                                                                    stats.belum_mulai
                                                                }
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "Proses"
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                                            currentStatus ===
                                                            "Proses"
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span>Proses</span>
                                                        {stats.proses !==
                                                            undefined && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-600">
                                                                {stats.proses}
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "Waiting"
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                                            currentStatus ===
                                                            "Waiting"
                                                                ? "bg-yellow-50 text-yellow-700"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span>
                                                            Waiting Approval
                                                        </span>
                                                        {stats.waiting !==
                                                            undefined && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-200 text-yellow-600">
                                                                {stats.waiting}
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "Selesai"
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                                            currentStatus ===
                                                            "Selesai"
                                                                ? "bg-green-50 text-green-700"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span>Selesai</span>
                                                        {stats.selesai !==
                                                            undefined && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-green-200 text-green-600">
                                                                {stats.selesai}
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "Rejected"
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                                            currentStatus ===
                                                            "Rejected"
                                                                ? "bg-red-50 text-red-700"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span>Rejected</span>
                                                        {stats.rejected !==
                                                            undefined && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-red-200 text-red-600">
                                                                {stats.rejected}
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "Lewat Waktu"
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                                            currentStatus ===
                                                            "Lewat Waktu"
                                                                ? "bg-red-50 text-red-700"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span>Lewat Waktu</span>
                                                        {stats.lewat_waktu !==
                                                            undefined && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-red-200 text-red-600">
                                                                {
                                                                    stats.lewat_waktu
                                                                }
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>

                                    {user.role === "asisten_bengkel" && (
                                        <a
                                            href="/jobs/create"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                        >
                                            + Tambah Job Karyawan
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Results Info */}
                            <div className="mb-4 text-sm text-gray-600">
                                Menampilkan {jobs.length} pekerjaan
                                {currentStatus &&
                                    ` dengan status "${currentStatus}"`}
                            </div>

                            {/* Jobs Table */}
                            {jobs.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto max-w-sm">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                            />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            {currentStatus
                                                ? "Tidak ada pekerjaan"
                                                : "Belum ada pekerjaan"}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {currentStatus
                                                ? `Tidak ada pekerjaan dengan status "${currentStatus}"`
                                                : "Mulai dengan membuat pekerjaan baru"}
                                        </p>
                                        {!currentStatus &&
                                            user.role === "asisten_bengkel" && (
                                                <div className="mt-6">
                                                    <a
                                                        href="/jobs/create"
                                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        + Tambah Job Karyawan
                                                        Pertama
                                                    </a>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pekerjaan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mekanik
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estimasi
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Waktu Mulai
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Dibuat
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {jobs.map((job) => (
                                                <tr
                                                    key={job.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {job.nama_pekerjaan}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {job.mekanik}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {job.estimasi_menit}{" "}
                                                            menit
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(
                                                                job.status
                                                            )}`}
                                                        >
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {job.waktu_mulai
                                                                ? formatDate(
                                                                      job.waktu_mulai
                                                                  )
                                                                : "-"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {formatDate(
                                                                job.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex gap-2">
                                                            <a
                                                                href={`/jobs/${job.id}`}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Detail
                                                            </a>

                                                            {/* Manager, Askep & Asisten Bengkel Actions */}
                                                            {(user.role ===
                                                                "manager" ||
                                                                user.role ===
                                                                    "askep" ||
                                                                user.role ===
                                                                    "asisten_bengkel") &&
                                                                job.status !==
                                                                    "Selesai" && (
                                                                    <>
                                                                        <a
                                                                            href={`/jobs/${job.id}/edit`}
                                                                            className="text-indigo-600 hover:text-indigo-900"
                                                                        >
                                                                            Edit
                                                                        </a>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    job.id
                                                                                )
                                                                            }
                                                                            className="text-red-600 hover:text-red-900"
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    </>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
