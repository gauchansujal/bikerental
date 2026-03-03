import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import UpdateUserForm from "../../_components/UpdateUserForm"; // ✅ make sure this path is correct
import Link from "next/link";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const response = await handleGetOneUser(id);

    if (!response.success) {
        return (
            <div className="p-6">
                <p className="text-red-500">{response.message || 'Failed to load user'}</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href={`/admin/users/${id}`}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2 inline-block"
                >
                    ← Back to User Details
                </Link>
                <h1 className="text-2xl font-bold">Edit User</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update user details
                </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
                <UpdateUserForm user={response.data} />  {/* ✅ user not bike */}
            </div>
        </div>
    );
}