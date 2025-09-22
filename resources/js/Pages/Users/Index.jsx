import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function UsersIndex({ users, filters = {}, roleStats = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedRole, setSelectedRole] = useState(filters.role || "all");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = (userId) => {
        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            setIsLoading(true);
            router.delete(`/users/${userId}`, {
                onFinish: () => setIsLoading(false),
            });
        }
    };

    const handleFilter = () => {
        setIsLoading(true);
        router.get(
            "/users",
            {
                search: search,
                role: selectedRole,
                per_page: perPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleReset = () => {
        setSearch("");
        setSelectedRole("all");
        setPerPage(10);
        setIsLoading(true);
        router.get(
            "/users",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Auto search on input change with debounce
    useEffect(() => {
        if (filters.search !== search) {
            const timer = setTimeout(() => {
                handleFilter();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [search]);

    // Immediate filter for role and per_page changes
    useEffect(() => {
        if (filters.role !== selectedRole || filters.per_page != perPage) {
            handleFilter();
        }
    }, [selectedRole, perPage]);

    const getRoleColor = (role) => {
        const colors = {
            manager: "bg-red-600",
            askep: "bg-red-500",
            asisten_bengkel: "bg-blue-600",
            asisten_proses: "bg-blue-500",
            karyawan: "bg-green-500",
        };
        return colors[role] || "bg-gray-500";
    };

    const getRoleLabel = (role) => {
        const labels = {
            manager: "Manager",
            askep: "Asisten Kepala",
            asisten_bengkel: "Asisten Bengkel",
            asisten_proses: "Asisten Proses",
            karyawan: "Karyawan",
        };
        return labels[role] || role;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manajemen User
                </h2>
            }
        >
            <Head title="Manajemen User" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <div
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedRole === "all"
                                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500 shadow-lg transform scale-105"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setSelectedRole("all")}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                    {roleStats?.all || 0}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 font-medium">
                                    Total User
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedRole === "manager"
                                    ? "bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-500 shadow-lg transform scale-105"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setSelectedRole("manager")}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {roleStats?.manager || 0}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 font-medium">
                                    Manager
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedRole === "askep"
                                    ? "bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 shadow-lg transform scale-105"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setSelectedRole("askep")}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-500">
                                    {roleStats?.askep || 0}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 font-medium">
                                    Askep
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedRole === "asisten_bengkel"
                                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-600 shadow-lg transform scale-105"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setSelectedRole("asisten_bengkel")}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {roleStats?.asisten_bengkel || 0}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 font-medium">
                                    Asisten Bengkel
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedRole === "asisten_proses"
                                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500 shadow-lg transform scale-105"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setSelectedRole("asisten_proses")}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-500">
                                    {roleStats?.asisten_proses || 0}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 font-medium">
                                    Asisten Proses
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedRole === "karyawan"
                                    ? "bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 shadow-lg transform scale-105"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md hover:scale-105"
                            }`}
                            onClick={() => setSelectedRole("karyawan")}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-500">
                                    {roleStats?.karyawan || 0}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 font-medium">
                                    Karyawan
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <svg
                                            className="w-6 h-6 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                            />
                                        </svg>
                                        Manajemen User
                                    </h3>
                                    {users && users.total > 0 && (
                                        <p className="text-sm text-gray-600 mt-2 flex items-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                                Total: {users.total}
                                            </span>
                                            {users.total !==
                                                users.to - users.from + 1 && (
                                                <span className="text-gray-500">
                                                    Menampilkan {users.from}-
                                                    {users.to}
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>

                                {/* Add User Button */}
                                <div className="flex-shrink-0">
                                    <a
                                        href="/users/create"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">
                                            Tambah User
                                        </span>
                                        <span className="sm:hidden">
                                            Tambah
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters Section */}
                        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
                            {/* Search Bar */}
                            <div className="mb-6">
                                <label
                                    htmlFor="search"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Pencarian User
                                </label>
                                <div className="relative">
                                    <svg
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        id="search"
                                        type="text"
                                        placeholder="Cari berdasarkan nama atau email..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm placeholder-gray-400 transition-all duration-200"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                {/* Role Filter */}
                                <div className="flex-1">
                                    <label
                                        htmlFor="roleFilter"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Filter Role
                                    </label>
                                    <select
                                        id="roleFilter"
                                        value={selectedRole}
                                        onChange={(e) =>
                                            setSelectedRole(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                                    >
                                        <option value="all">
                                            🌐 Semua Role
                                        </option>
                                        <option value="manager">
                                            🏢 Manager
                                        </option>
                                        <option value="askep">
                                            👨‍💼 Asisten Kepala
                                        </option>
                                        <option value="asisten_bengkel">
                                            🔧 Asisten Bengkel
                                        </option>
                                        <option value="asisten_proses">
                                            ⚙️ Asisten Proses
                                        </option>
                                        <option value="karyawan">
                                            👷 Karyawan
                                        </option>
                                    </select>
                                </div>

                                {/* Per Page Selector */}
                                <div className="flex-1 sm:flex-none sm:w-32">
                                    <label
                                        htmlFor="perPage"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Per Halaman
                                    </label>
                                    <select
                                        id="perPage"
                                        value={perPage}
                                        onChange={(e) =>
                                            setPerPage(parseInt(e.target.value))
                                        }
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>

                                {/* Reset Button */}
                                {(search || selectedRole !== "all") && (
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={handleReset}
                                            className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
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
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            Reset Filter
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Active Filters Display */}
                            {(search || selectedRole !== "all") && (
                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                                    <span className="text-sm text-gray-500 font-medium">
                                        Filter aktif:
                                    </span>
                                    {search && (
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                            🔍 Pencarian: "{search}"
                                            <button
                                                onClick={() => setSearch("")}
                                                className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {selectedRole !== "all" && (
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            👤 Role:{" "}
                                            {getRoleLabel(selectedRole)}
                                            <button
                                                onClick={() =>
                                                    setSelectedRole("all")
                                                }
                                                className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                                            >
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="relative">
                            {/* Loading State */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                                    <div className="flex items-center space-x-3 bg-white p-6 rounded-xl shadow-lg border">
                                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                                        <span className="text-gray-700 font-medium text-lg">
                                            Memuat data...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!users ||
                            !users.data ||
                            users.data.length === 0 ? (
                                <div className="text-center py-16 px-6">
                                    <div className="mx-auto max-w-md">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-10 h-10 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {search || selectedRole !== "all"
                                                ? "Tidak ada user ditemukan"
                                                : "Belum ada user"}
                                        </h3>
                                        <p className="text-gray-500 mb-6">
                                            {search || selectedRole !== "all"
                                                ? "Coba ubah filter atau kata kunci pencarian untuk menemukan user yang Anda cari"
                                                : "Mulai dengan menambahkan user pertama ke dalam sistem"}
                                        </p>
                                        {!search && selectedRole === "all" && (
                                            <a
                                                href="/users/create"
                                                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                Tambah User Pertama
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Informasi User
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Role & Status
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Tanggal Bergabung
                                                    </th>
                                                    <th className="relative px-6 py-4">
                                                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            Aksi
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.data &&
                                                    users.data.map(
                                                        (user, index) => (
                                                            <tr
                                                                key={user.id}
                                                                className={`hover:bg-gray-50 transition-all duration-200 ${
                                                                    index %
                                                                        2 ===
                                                                    0
                                                                        ? "bg-white"
                                                                        : "bg-gray-25"
                                                                }`}
                                                            >
                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="h-12 w-12 flex-shrink-0">
                                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                                                                                <span className="text-lg font-bold text-white">
                                                                                    {user.name
                                                                                        .charAt(
                                                                                            0
                                                                                        )
                                                                                        .toUpperCase()}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-semibold text-gray-900">
                                                                                {
                                                                                    user.name
                                                                                }
                                                                            </div>
                                                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                                                <svg
                                                                                    className="w-4 h-4 mr-1"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={
                                                                                            2
                                                                                        }
                                                                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                                                    />
                                                                                </svg>
                                                                                {
                                                                                    user.email
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <div className="flex flex-col items-start">
                                                                        <span
                                                                            className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full text-white shadow-sm ${getRoleColor(
                                                                                user.role
                                                                            )}`}
                                                                        >
                                                                            {getRoleLabel(
                                                                                user.role
                                                                            )}
                                                                        </span>
                                                                        <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                                                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></div>
                                                                            Aktif
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 font-medium">
                                                                        {new Date(
                                                                            user.created_at
                                                                        ).toLocaleDateString(
                                                                            "id-ID",
                                                                            {
                                                                                day: "numeric",
                                                                                month: "long",
                                                                                year: "numeric",
                                                                            }
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {new Date(
                                                                            user.created_at
                                                                        ).toLocaleTimeString(
                                                                            "id-ID",
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-6 whitespace-nowrap text-right">
                                                                    <div className="flex justify-end space-x-2">
                                                                        {/* Detail Button */}
                                                                        <div className="relative group">
                                                                            <a
                                                                                href={`/users/${user.id}`}
                                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-900 transition-all duration-200 rounded-lg hover:bg-blue-50"
                                                                            >
                                                                                Detail
                                                                            </a>
                                                                            {/* Tooltip */}
                                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                                                                Lihat
                                                                                Detail
                                                                                User
                                                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Edit Button */}
                                                                        <div className="relative group">
                                                                            <a
                                                                                href={`/users/${user.id}/edit`}
                                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900 transition-all duration-200 rounded-lg hover:bg-indigo-50"
                                                                            >
                                                                                Edit
                                                                            </a>
                                                                            {/* Tooltip */}
                                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                                                                Edit
                                                                                Data
                                                                                User
                                                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Hapus Button */}
                                                                        <div className="relative group">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        user.id
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-900 transition-all duration-200 rounded-lg hover:bg-red-50"
                                                                                disabled={
                                                                                    isLoading
                                                                                }
                                                                            >
                                                                                Hapus
                                                                            </button>
                                                                            {/* Tooltip */}
                                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                                                                Hapus
                                                                                Data
                                                                                User
                                                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {users.links && users.links.length > 3 && (
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                            <Pagination
                                                links={users.links}
                                                meta={{
                                                    from: users.from,
                                                    to: users.to,
                                                    total: users.total,
                                                }}
                                                className="border-0 bg-transparent p-0"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
