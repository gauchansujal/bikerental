"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleDeleteBike } from "@/lib/actions/admin/bike.action";
import DeleteModal from "@/app/_components/DeleteModel";

const BikeTable = (
    { bikes, pagination, search }: { bikes: any[], pagination: any, search?: string }
) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search || '');

    const handleSearchChange = () => {
        router.push(`/admin/bikes?page=1&size=${pagination.size}` +
            (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''));
    };

    const makePagination = (): React.ReactElement[] => {
        const pages = [];
        const currentPage = pagination.page;
        const totalPages = pagination.totalPages;
        const delta = 2;

        // Previous button
        const prevHref = `/admin/bikes?page=${currentPage - 1}&size=${pagination.size}` +
            (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '');
        pages.push(
            <Link key="prev"
                className={`px-3 py-1 border rounded-md 
                    ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                href={currentPage === 1 ? '#' : prevHref}>
                Previous
            </Link>
        );

        // Calculate range of pages to show
        let startPage = Math.max(1, currentPage - delta);
        let endPage = Math.min(totalPages, currentPage + delta);

        // Add first page if not in range
        if (startPage > 1) {
            const href = `/admin/bikes?page=1&size=${pagination.size}` +
                (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '');
            pages.push(
                <Link key={1}
                    className="px-3 py-1 border rounded-md bg-white text-blue-500 hover:bg-blue-100"
                    href={href}>
                    1
                </Link>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis1" className="px-2 text-gray-500">...</span>
                );
            }
        }

        // Add page numbers in range
        for (let i = startPage; i <= endPage; i++) {
            const href = `/admin/bikes?page=${i}&size=${pagination.size}` +
                (search ? `&search=${encodeURIComponent(search)}` : '');
            pages.push(
                <Link key={i}
                    className={`px-3 py-1 border rounded-md 
                        ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                    href={href}>
                    {i}
                </Link>
            );
        }

        // Add last page if not in range
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis2" className="px-2 text-gray-500">...</span>
                );
            }
            const href = `/admin/bikes?page=${totalPages}&size=${pagination.size}` +
                (search ? `&search=${encodeURIComponent(search)}` : '');
            pages.push(
                <Link key={totalPages}
                    className="px-3 py-1 border rounded-md bg-white text-blue-500 hover:bg-blue-100"
                    href={href}>
                    {totalPages}
                </Link>
            );
        }

        // Next button
        const nextHref = `/admin/bikes?page=${currentPage + 1}&size=${pagination.size}` +
            (search ? `&search=${encodeURIComponent(search)}` : '');
        pages.push(
            <Link key="next"
                className={`px-3 py-1 border rounded-md 
                    ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                href={currentPage === totalPages ? '#' : nextHref}>
                Next
            </Link>
        );

        return pages;
    }

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const onDelete = async () => {
        try {
            await handleDeleteBike(deleteId!);
            toast.success("Bike deleted successfully");
        } catch (err: Error | any) {
            toast.error(err.message || "Failed to delete bike");
        } finally {
            setDeleteId(null);
        }
    }

    return (
        <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={onDelete}
                title="Delete Confirmation"
                description="Are you sure you want to delete this item? This action cannot be undone."
            />

            <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchChange();
                        }
                    }}
                    placeholder="Search bikes..."
                    className="mr-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSearchChange}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Search
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Image</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Brand</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Engine (CC)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {bikes.map((bike) => (
                            <tr key={bike._id}>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{bike._id}</td>
                                <td className="px-4 py-2">
                                    {bike.imageUrl ? (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${bike.imageUrl}`}
                                            alt="Bike Image"
                                            className="w-10 h-10 rounded object-cover"
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                                            <span className="text-gray-600 text-sm">N/A</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{bike.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{bike.brand}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{bike.engineCC}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">${bike.price || "N/A"}</td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    <Link href={`/admin/bikes/${bike._id}`} className="text-green-500 hover:underline">View</Link>
                                    <Link href={`/admin/bikes/${bike._id}/edit`} className="text-blue-500 ml-4 hover:underline">Edit</Link>
                                    <button
                                        onClick={() => setDeleteId(bike._id)}
                                        className="ml-4 text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="space-x-2">
                    {makePagination()}
                </div>
            </div>
        </div>
    );
}

export default BikeTable;