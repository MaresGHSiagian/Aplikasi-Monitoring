import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk - Monitor Bengkel" />

            {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Masuk ke Akun Anda
                </h2>
                <p className="text-gray-600 text-sm">
                    Akses sistem monitoring pekerjaan bengkel
                </p>
            </div>

            {status && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Masukkan email Anda"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Masukkan password Anda"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Ingat saya
                        </span>
                    </label>

                    {/* {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        >
                            Lupa password?
                        </Link>
                    )} */}
                </div>

                <div className="space-y-3">
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        disabled={processing}
                    >
                        {processing ? "Sedang masuk..." : "Masuk"}
                    </PrimaryButton>

                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Belum punya akun?{" "}
                        </span>
                        <Link
                            href={route("register")}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Daftar sekarang
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
