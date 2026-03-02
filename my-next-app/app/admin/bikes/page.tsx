import Link from "next/link";
import { fetchBikesPaginated } from "@/lib/actions/bike.action";
// import BikeTable from "./_components/BikeTable";

export default async function BikesPage({
    searchParams,
}: {
    searchParams: { page?: string; size?: string; search?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const size = Number(searchParams.size) || 10;
    const search = searchParams.search || '';

    const result = await fetchBikesPaginated(page, size, search);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Bikes</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your bike inventory
                    </p>
                </div>
                <Link
                    href="/admin/bikes/create"
                    className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90"
                >
                    + Add Bike
                </Link>
            </div>

            {/* <BikeTable
                bikes={result.bikes}
                pagination={result.pagination}
                search={search}
            /> */}
        </div>
    );
}