import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ stations }) {
    const { data, setData, post, processing, errors } = useForm({
        no: "",
        stasiun: "",
        keterangan_kerusakan: "",
        catatan: "",
        gambar: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("damage-reports.store"));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("gambar", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tambah Laporan Kerusakan
                </h2>
            }
        >
            <Head title="Tambah Laporan Kerusakan" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Form Laporan Kerusakan Baru
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Isi semua informasi yang diperlukan untuk
                                    laporan kerusakan
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nomor Laporan */}
                                    <div>
                                        <label
                                            htmlFor="no"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Nomor Laporan{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="no"
                                            value={data.no}
                                            onChange={(e) =>
                                                setData("no", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Contoh: DMG-2025-001"
                                        />
                                        {errors.no && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.no}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stasiun */}
                                    <div>
                                        <label
                                            htmlFor="stasiun"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Stasiun{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            id="stasiun"
                                            value={data.stasiun}
                                            onChange={(e) =>
                                                setData(
                                                    "stasiun",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">
                                                Pilih Stasiun
                                            </option>
                                            {Object.entries(stations).map(
                                                ([key, label]) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        {errors.stasiun && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.stasiun}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Keterangan Kerusakan */}
                                <div>
                                    <label
                                        htmlFor="keterangan_kerusakan"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Keterangan Kerusakan{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="keterangan_kerusakan"
                                        rows={4}
                                        value={data.keterangan_kerusakan}
                                        onChange={(e) =>
                                            setData(
                                                "keterangan_kerusakan",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Deskripsikan kerusakan yang terjadi secara detail..."
                                    />
                                    {errors.keterangan_kerusakan && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.keterangan_kerusakan}
                                        </p>
                                    )}
                                </div>

                                {/* Catatan */}
                                <div>
                                    <label
                                        htmlFor="catatan"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Catatan Detail
                                    </label>
                                    <textarea
                                        id="catatan"
                                        rows={4}
                                        value={data.catatan}
                                        onChange={(e) =>
                                            setData("catatan", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Tambahan informasi, tindakan yang sudah dilakukan, dll..."
                                    />
                                    {errors.catatan && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.catatan}
                                        </p>
                                    )}
                                </div>

                                {/* Upload Gambar */}
                                <div>
                                    <label
                                        htmlFor="gambar"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Foto Kerusakan
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                                        <div className="space-y-1 text-center">
                                            {imagePreview ? (
                                                <div className="mb-4">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagePreview(
                                                                null
                                                            );
                                                            setData(
                                                                "gambar",
                                                                null
                                                            );
                                                        }}
                                                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Hapus Gambar
                                                    </button>
                                                </div>
                                            ) : (
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="gambar"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                >
                                                    <span>
                                                        {imagePreview
                                                            ? "Ganti gambar"
                                                            : "Upload foto"}
                                                    </span>
                                                    <input
                                                        id="gambar"
                                                        name="gambar"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                    />
                                                </label>
                                                <p className="pl-1">
                                                    atau drag dan drop
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, JPEG hingga 2MB
                                            </p>
                                        </div>
                                    </div>
                                    {errors.gambar && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.gambar}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t">
                                    <Link
                                        href={route("damage-reports.index")}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Laporan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
