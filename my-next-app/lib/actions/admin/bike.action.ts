"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BASE_URL = "http://localhost:5000";

// 🔒 ADMIN ONLY - Create
export async function handleCreateBike(formData: FormData) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

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

// 🔒 ADMIN ONLY - Update
export async function handleUpdateBike(id: string, formData: FormData) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

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

// 🔒 ADMIN ONLY - Delete
export async function handleDeleteBike(id: string) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

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