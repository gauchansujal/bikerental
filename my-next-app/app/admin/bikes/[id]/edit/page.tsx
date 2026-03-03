import { fetchBikeById } from "@/lib/actions/bike.action";
import EditBikeForm from "../../_components/UpdateBike";
import Link from "next/link";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const bike = await fetchBikeById(id);

    if (!bike) {
        return (
            <div className="p-6">
                <p className="text-red-500">Bike not found. ID: {id}</p>
                <p className="text-sm text-gray-500">Check your terminal for fetch errors.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href={`/admin/bikes/${id}`}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2 inline-block"
                >
                    ← Back to Bike Details
                </Link>
                <h1 className="text-2xl font-bold">Edit Bike</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update bike details
                </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
                <EditBikeForm bike={bike} />
            </div>
        </div>
    );
}