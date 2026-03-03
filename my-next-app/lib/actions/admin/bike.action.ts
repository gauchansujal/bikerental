"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5000";

export async function handleGetAllBikesAdmin(
    page: number = 1,
    size: number = 10,
    search?: string
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value; // ✅ fixed

        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("size", String(size));
        if (search) params.set("search", search);

        const response = await fetch(`${BASE_URL}/api/bike?${params.toString()}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Failed to fetch bikes" };
        }

        return {
            success: true,
            data: data.bikes ?? [],
            pagination: data.pagination ?? {
                page,
                size,
                totalItems: 0,
                totalPages: 0,
            },
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || "Failed to fetch bikes" };
    }
}

export async function handleCreateBike(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value; // ✅ fixed

        const response = await fetch(`${BASE_URL}/api/bike/`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Failed to create bike" };
        }

        revalidatePath("/admin/bikes");
        return { success: true, message: "Bike created successfully", data };
    } catch (error: Error | any) {
        return { success: false, message: error.message || "Failed to create bike" };
    }
}

export async function handleUpdateBike(id: string, formData: FormData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value; // ✅ fixed

        const response = await fetch(`${BASE_URL}/api/bike/${id}`, {
            method: "PUT",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Failed to update bike" };
        }

        revalidatePath("/admin/bikes");
        revalidatePath(`/admin/bikes/${id}/edit`);
        return { success: true, message: "Bike updated successfully", data };
    } catch (error: Error | any) {
        return { success: false, message: error.message || "Failed to update bike" };
    }
}

export async function handleDeleteBike(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value; // ✅ fixed

        const response = await fetch(`${BASE_URL}/api/bike/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Failed to delete bike" };
        }

        revalidatePath("/admin/bikes");
        return { success: true, message: "Bike deleted successfully" };
    } catch (error: Error | any) {
        return { success: false, message: error.message || "Failed to delete bike" };
    }
}