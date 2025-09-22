import { Link } from "@inertiajs/react";

export default function Pagination({ links, meta, className = "" }) {
    if (!links || links.length <= 3 || !meta) return null;

    // Get page numbers for smart pagination
    const getPageNumbers = () => {
        const current = parseInt(links.find(link => link.active)?.label || 1);
        const total = links.length - 2; // Exclude prev/next buttons
        const pages = [];
        
        if (total <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            // Smart pagination for many pages
            if (current <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', total);
            } else if (current >= total - 3) {
                pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
            } else {
                pages.push(1, '...', current - 1, current, current + 1, '...', total);
            }
        }
        
        return pages;
    };

    const renderPageLink = (pageNum, index) => {
        if (pageNum === '...') {
            return (
                <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300"
                >
                    ...
                </span>
            );
        }

        const link = links.find(l => l.label == pageNum);
        if (!link) return null;

        if (link.active) {
            return (
                <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 z-10"
                >
                    {pageNum}
                </span>
            );
        }

        return (
            <Link
                key={index}
                href={link.url}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition duration-200 ease-in-out"
                preserveScroll
                preserveState
            >
                {pageNum}
            </Link>
        );
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`bg-white flex items-center justify-between ${className}`}>
            {/* Mobile pagination info */}
            <div className="flex-1 flex justify-between sm:hidden">
                {links[0]?.url ? (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        preserveScroll
                        preserveState
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Sebelumnya
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Sebelumnya
                    </span>
                )}

                <span className="text-sm text-gray-700 flex items-center px-4">
                    {meta?.from || 0} - {meta?.to || 0} dari {meta?.total || 0}
                </span>

                {links[links.length - 1]?.url ? (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        preserveScroll
                        preserveState
                    >
                        Selanjutnya
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed">
                        Selanjutnya
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                )}
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center">
                    <p className="text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                        Menampilkan{" "}
                        <span className="font-semibold text-gray-900">{meta?.from || 0}</span>
                        {" "}sampai{" "}
                        <span className="font-semibold text-gray-900">{meta?.to || 0}</span>
                        {" "}dari{" "}
                        <span className="font-semibold text-blue-600">{meta?.total || 0}</span>
                        {" "}hasil
                    </p>
                </div>
                
                <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    {links[0]?.url ? (
                        <Link
                            href={links[0].url}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
                            preserveScroll
                            preserveState
                        >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </Link>
                    ) : (
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </span>
                    )}

                    {/* Page Numbers */}
                    <nav className="flex space-x-1" aria-label="Pagination">
                        {pageNumbers.map((pageNum, index) => renderPageLink(pageNum, index))}
                    </nav>

                    {/* Next Button */}
                    {links[links.length - 1]?.url ? (
                        <Link
                            href={links[links.length - 1].url}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
                            preserveScroll
                            preserveState
                        >
                            Next
                            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ) : (
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed">
                            Next
                            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}