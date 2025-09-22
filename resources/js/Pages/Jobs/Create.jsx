import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function CreateJob({ mechanics = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_pekerjaan: "",
        mekanik: "",
        estimasi_menit: "",
    });

    const [searchTerm, setSearchTerm] = useState(data.mekanik || "");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredMechanics, setFilteredMechanics] = useState(mechanics);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Sinkronisasi searchTerm dengan data.mekanik
    useEffect(() => {
        setSearchTerm(data.mekanik);
    }, [data.mekanik]);

    useEffect(() => {
        if (searchTerm === "") {
            // Jika searchTerm kosong, tampilkan semua karyawan
            const allKaryawan = mechanics.filter(
                (mechanic) => mechanic.role === "karyawan"
            );
            setFilteredMechanics(allKaryawan);
        } else {
            // Jika ada searchTerm, filter berdasarkan nama
            const filtered = mechanics.filter(
                (mechanic) =>
                    mechanic.role === "karyawan" &&
                    mechanic.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            setFilteredMechanics(filtered);
        }
    }, [searchTerm, mechanics]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest("#mekanik-container")) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/jobs");
    };

    const handleMechanicSelect = (mechanic) => {
        console.log("Selected mechanic:", mechanic);
        setData("mekanik", mechanic.name);
        setSearchTerm(mechanic.name);
        setShowDropdown(false);
        setSelectedIndex(-1);
    };

    const handleInputChange = (value) => {
        console.log("Input changed to:", value);
        setData("mekanik", value);
        setSearchTerm(value);
        setShowDropdown(true);
        setSelectedIndex(-1);
    };

    const handleInputFocus = () => {
        console.log("Input focused - mechanics:", mechanics.length);
        console.log("All mechanics:", mechanics);
        setShowDropdown(true);
        // Ensure we show all karyawan mechanics when focused
        if (!searchTerm || searchTerm === "") {
            const allKaryawan = mechanics.filter(
                (mechanic) => mechanic.role === "karyawan"
            );
            console.log("Filtered karyawan:", allKaryawan);
            setFilteredMechanics(allKaryawan);
        }
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || filteredMechanics.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredMechanics.length - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredMechanics.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleMechanicSelect(filteredMechanics[selectedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tambah Pekerjaan Baru
                </h2>
            }
        >
            <Head title="Tambah Pekerjaan" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="nama_pekerjaan"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Nama Pekerjaan
                                    </label>
                                    <input
                                        type="text"
                                        id="nama_pekerjaan"
                                        value={data.nama_pekerjaan}
                                        onChange={(e) =>
                                            setData(
                                                "nama_pekerjaan",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan nama pekerjaan"
                                    />
                                    {errors.nama_pekerjaan && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.nama_pekerjaan}
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="relative"
                                    id="mekanik-container"
                                >
                                    <label
                                        htmlFor="mekanik"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Nama Mekanik
                                    </label>
                                    <input
                                        type="text"
                                        id="mekanik"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            handleInputChange(e.target.value)
                                        }
                                        onFocus={handleInputFocus}
                                        onKeyDown={handleKeyDown}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Pilih atau ketik nama mekanik"
                                        autoComplete="off"
                                    />

                                    {/* Dropdown Mekanik - Didalam Form */}
                                    {showDropdown &&
                                        filteredMechanics &&
                                        filteredMechanics.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                {filteredMechanics.map(
                                                    (mechanic, index) => (
                                                        <div
                                                            key={mechanic.id}
                                                            onClick={() =>
                                                                handleMechanicSelect(
                                                                    mechanic
                                                                )
                                                            }
                                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                                                data.mekanik ===
                                                                mechanic.name
                                                                    ? "bg-blue-50 text-blue-700 font-medium"
                                                                    : index ===
                                                                      selectedIndex
                                                                    ? "bg-gray-100"
                                                                    : "text-gray-900"
                                                            } ${
                                                                index !==
                                                                filteredMechanics.length -
                                                                    1
                                                                    ? "border-b border-gray-100"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {
                                                                            mechanic.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {
                                                                            mechanic.role
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {data.mekanik ===
                                                                    mechanic.name && (
                                                                    <svg
                                                                        className="w-4 h-4 text-blue-600"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {/* Empty State Dropdown */}
                                    {showDropdown &&
                                        searchTerm &&
                                        filteredMechanics.length === 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                                <div className="px-4 py-6 text-center">
                                                    <svg
                                                        className="mx-auto h-8 w-8 text-gray-400 mb-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                        />
                                                    </svg>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                        Tidak ada mekanik
                                                        ditemukan
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Coba kata kunci lain
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    {errors.mekanik && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.mekanik}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="estimasi_menit"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Estimasi Waktu (menit)
                                    </label>
                                    <input
                                        type="number"
                                        id="estimasi_menit"
                                        value={data.estimasi_menit}
                                        onChange={(e) =>
                                            setData(
                                                "estimasi_menit",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan estimasi waktu dalam menit"
                                        min="1"
                                    />
                                    {errors.estimasi_menit && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.estimasi_menit}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </button>
                                    <a
                                        href="/jobs"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Batal
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
