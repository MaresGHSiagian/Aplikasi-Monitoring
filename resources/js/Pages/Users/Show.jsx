import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ user }) {
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID");
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detail User: {user.name}
                </h2>
            }
        >
            <Head title={`Detail User: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {user.name}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded text-sm text-white ${getRoleColor(
                                            user.role
                                        )}`}
                                    >
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`/users/${user.id}/edit`}
                                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Edit
                                    </a>
                                    <a
                                        href="/users"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Kembali
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Informasi User
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Role
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {user.role}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tanggal Bergabung
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Status
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                                            <p className="text-green-700 font-medium">
                                                ✓ User Aktif
                                            </p>
                                            <p className="text-sm text-green-600 mt-1">
                                                User dapat mengakses sistem
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
