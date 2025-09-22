import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function EditJob({ job, mechanics = [] }) {
    const { data, setData, patch, processing, errors } = useForm({
        nama_pekerjaan: job.nama_pekerjaan || "",
        mekanik: job.mekanik || "",
        estimasi_menit: job.estimasi_menit || "",
    });

    const [searchTerm, setSearchTerm] = useState(job.mekanik || "");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredMechanics, setFilteredMechanics] = useState(mechanics);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [inputPosition, setInputPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    useEffect(() => {
        const filtered = mechanics.filter(
            (mechanic) =>
                mechanic.role === "karyawan" &&
                mechanic.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMechanics(filtered);
    }, [searchTerm, mechanics]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest("#mekanik-container")) {
                setShowDropdown(false);
            }
        };

        const updatePosition = () => {
            const inputElement = document.getElementById("mekanik");
            if (inputElement && showDropdown) {
                const rect = inputElement.getBoundingClientRect();
                setInputPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", updatePosition);
            window.removeEventListener("resize", updatePosition);
        };
    }, [showDropdown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(`/jobs/${job.id}`);
    };

    const handleMechanicSelect = (mechanic) => {
        setData("mekanik", mechanic.name);
        setSearchTerm(mechanic.name);
        setShowDropdown(false);
    };

    const handleInputChange = (value) => {
        setData("mekanik", value);
        setSearchTerm(value);
        setShowDropdown(true);
        setSelectedIndex(-1);
        updateDropdownPosition();
    };

    const updateDropdownPosition = () => {
        // Calculate input position for fixed dropdown
        const inputElement = document.getElementById("mekanik");
        if (inputElement) {
            const rect = inputElement.getBoundingClientRect();
            setInputPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    const handleInputFocus = () => {
        console.log("Input focused - mechanics:", mechanics.length);
        console.log("All mechanics:", mechanics);
        setShowDropdown(true);
        updateDropdownPosition();
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
                    Edit Pekerjaan: {job.nama_pekerjaan}
                </h2>
            }
        >
            <Head title={`Edit Pekerjaan: ${job.nama_pekerjaan}`} />

            <div className="py-12" style={{ overflow: "visible" }}>
                <div
                    className="mx-auto max-w-2xl sm:px-6 lg:px-8"
                    style={{ overflow: "visible" }}
                >
                    <div
                        className="bg-white shadow-sm sm:rounded-lg relative"
                        style={{ overflow: "visible", zIndex: 1 }}
                    >
                        <div
                            className="p-6 relative"
                            style={{ overflow: "visible" }}
                        >
                            <form
                                onSubmit={handleSubmit}
                                className="relative"
                                style={{ overflow: "visible" }}
                            >
                                <div className="mb-4">
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
                                    className="mb-6 relative"
                                    id="mekanik-container"
                                    style={{ minHeight: "80px" }}
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
                                        value={data.mekanik}
                                        onChange={(e) =>
                                            handleInputChange(e.target.value)
                                        }
                                        onFocus={handleInputFocus}
                                        onKeyDown={handleKeyDown}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Pilih atau ketik nama mekanik"
                                        autoComplete="off"
                                    />

                                    {errors.mekanik && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.mekanik}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
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
                                        {processing ? "Menyimpan..." : "Update"}
                                    </button>
                                    <a
                                        href={`/jobs/${job.id}`}
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

            {/* Dropdown Mekanik - Outside Form */}
            {showDropdown && filteredMechanics.length > 0 && (
                <div
                    className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl"
                    style={{
                        top: inputPosition.top + "px",
                        left: inputPosition.left + "px",
                        width: inputPosition.width + "px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        maxHeight: "240px",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    {filteredMechanics.map((mechanic, index) => (
                        <div
                            key={mechanic.id}
                            onClick={() => handleMechanicSelect(mechanic)}
                            className={`px-4 py-3 cursor-pointer transition-all duration-150 ease-in-out
                                ${
                                    data.mekanik === mechanic.name
                                        ? "bg-blue-50 border-l-4 border-blue-400"
                                        : index === selectedIndex
                                        ? "bg-gray-100"
                                        : "hover:bg-gray-50"
                                }
                                ${
                                    index !== filteredMechanics.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 truncate">
                                        {mechanic.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Karyawan
                                        </span>
                                    </div>
                                </div>
                                {data.mekanik === mechanic.name && (
                                    <div className="ml-2 text-blue-500">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                            {filteredMechanics.length} mekanik ditemukan
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State Dropdown - Outside Form */}
            {showDropdown && searchTerm && filteredMechanics.length === 0 && (
                <div
                    className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl"
                    style={{
                        top: inputPosition.top + "px",
                        left: inputPosition.left + "px",
                        width: inputPosition.width + "px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                >
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
                            Tidak ada mekanik ditemukan
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Coba kata kunci lain
                        </p>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
