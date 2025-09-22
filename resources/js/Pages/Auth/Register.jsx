import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar - Monitor Bengkel" />

            {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Daftar Akun Baru
                </h2>
                <p className="text-gray-600 text-sm">
                    Bergabung dengan sistem monitoring bengkel
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Masukkan alamat email"
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Buat password yang kuat"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        placeholder="Ulangi password Anda"
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="space-y-3 pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        disabled={processing}
                    >
                        {processing ? "Sedang mendaftar..." : "Daftar Sekarang"}
                    </PrimaryButton>

                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Sudah punya akun?{" "}
                        </span>
                        <Link
                            href={route("login")}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
