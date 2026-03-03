import Link from "next/link";
import { handleGetAllBikesAdmin } from "@/lib/actions/admin/bike.action";
import BikeTable from "../bikes/_components/BikesTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // ✅ Await searchParams first
    const params = await searchParams;
    
    const page = params.page as string || '1';
    const size = params.size as string || '10';
    const search = params.search as string || '';

    const response = await handleGetAllBikesAdmin(
        parseInt(page),
        parseInt(size),
        search as string
    );

    if (!response.success) {
        throw new Error(response.message || 'Failed to load bikes');
    }

    return (
        <div>
            <Link className="text-blue-500 border border-blue-500 p-2 rounded inline-block"
                href="/admin/bikes/create">Create Bike</Link>
            <BikeTable bikes={response.data} pagination={response.pagination} search={search} />
        </div>
    );
}