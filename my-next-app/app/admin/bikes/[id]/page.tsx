import { fetchBikeById } from "@/lib/actions/bike.action";
import Link from "next/link";
import Image from "next/image";

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
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-4 flex gap-4">
                <Link href="/admin/bikes" className="text-blue-500 hover:underline">Back to Bikes</Link>
                <Link href={`/admin/bikes/${id}/edit`} className="text-green-500 hover:underline">Edit Bike</Link>
            </div>

            <h1 className="text-2xl font-bold mb-4 mt-2">Bike Details</h1>

            <div className="border border-gray-300 rounded-lg p-4">
                {bike.imageUrl && (
                    <div className="mb-4">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${bike.imageUrl}`}
                            alt={bike.name}
                            className="w-full max-w-md h-64 rounded object-cover"
                            width={500}
                            height={256}
                        />
                    </div>
                )}
                <p><strong>Name:</strong> {bike.name}</p>
                <p><strong>Brand:</strong> {bike.brand}</p>
                <p><strong>Engine CC:</strong> {bike.engineCC}</p>
                <p><strong>Price:</strong> {bike.price ? `$${bike.price}` : "N/A"}</p>
                <p><strong>Mileage:</strong> {bike.milage || "N/A"}</p>
                <p>
                    <strong>Available:</strong>{" "}
                    <span className={`px-2 py-0.5 rounded text-sm font-medium ${
                        bike.isAvilable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {bike.isAvilable ? 'Yes' : 'No'}
                    </span>
                </p>
            </div>
        </div>
    );
}