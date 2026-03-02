import Link from "next/link";
import CreateBikeForm from "../_components/CreateBikes";

export default function CreateBikePage() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/bikes"
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2 inline-block"
                >
                    ← Back to Bikes
                </Link>
                <h1 className="text-2xl font-bold">Add New Bike</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Fill in the details to add a new bike to inventory
                </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
                <CreateBikeForm />
            </div>
        </div>
    );
}