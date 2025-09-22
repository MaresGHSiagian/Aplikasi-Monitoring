import ApplicationLogo from "@/Components/ApplicationLogo";
import Notification from "@/Components/Notification";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                ></div>
            </div>

            <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
                {/* Logo and Brand */}
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center space-x-3 mb-2">
                            <ApplicationLogo className="h-16 w-16 text-blue-400" />
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Monitor Bengkel
                                </h1>
                                <p className="text-blue-300 text-sm">
                                    Sistem Monitoring Pekerjaan
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-blue-200 text-sm">
                        © 2025 Monitor Bengkel. Sistem manajemen pekerjaan
                        terpadu.
                    </p>
                </div>
            </div>

            {/* Notification Component */}
            <Notification />
        </div>
    );
}
