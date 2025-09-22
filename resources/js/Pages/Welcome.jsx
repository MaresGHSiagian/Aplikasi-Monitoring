import { Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
import { router } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Welcome({ auth }) {
    // Redirect to dashboard if user is already logged in
    useEffect(() => {
        if (auth.user) {
            router.visit(route("dashboard"));
        }
    }, [auth.user]);

    // Don't render anything if user is logged in (prevents flash)
    if (auth.user) {
        return null;
    }

    return (
        <>
            <Head title="Monitor Bengkel" />

            {/* Hero Section */}
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    ></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
                    <div className="flex items-center space-x-3">
                        <ApplicationLogo className="h-10 w-auto text-white" />
                        <h1 className="text-2xl font-bold text-white">
                            Monitor Bengkel
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="text-white hover:text-blue-200 px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 lg:py-32">
                    <div className="text-center max-w-4xl">
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Sistem Monitoring
                            <span className="block text-blue-300">
                                Pekerjaan Bengkel
                            </span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-blue-200 mb-8 leading-relaxed">
                            Pantau dan kelola pekerjaan bengkel secara real-time
                            dengan sistem monitoring terpadu, tracking progress
                            otomatis, dan manajemen tugas yang efisien.
                        </p>

                        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Buka Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-200 transform hover:scale-105"
                                    >
                                        Daftar Gratis
                                    </Link>
                                </>
                            )}
                        </div> */}

                        {/* Feature Highlights */}
                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold mb-2">
                                    Real-time Monitoring
                                </h3>
                                <p className="text-blue-200 text-sm">
                                    Pantau progress pekerjaan dengan timer dan
                                    status update otomatis
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold mb-2">
                                    Manajemen Tugas
                                </h3>
                                <p className="text-blue-200 text-sm">
                                    Kelola dan assign pekerjaan ke karyawan
                                    dengan mudah
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold mb-2">
                                    Laporan & Analisis
                                </h3>
                                <p className="text-blue-200 text-sm">
                                    Dashboard analitik untuk performa dan
                                    produktivitas bengkel
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-10 py-8 px-6 border-t border-white/20">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-blue-200 mb-2">
                            © 2025 Monitor Bengkel. Sistem manajemen pekerjaan
                            terpadu.
                        </p>
                        <p className="text-blue-300 text-sm">
                            Tingkatkan efisiensi bengkel Anda dengan monitoring
                            real-time
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
