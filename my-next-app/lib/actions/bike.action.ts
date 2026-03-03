// lib/actions/bike.action.ts

export interface Bike {
  _id?: string;
  name: string;
  brand: string;
  engineCC: number;
  price?: number;
  milage?: string;
  imageUrl?: string;
  isAvilable?: boolean;
}

export interface PaginatedBikes {
  bikes: Bike[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}

const BASE_URL = "http://localhost:5000"; // ✅ single BASE_URL

// ✅ For BikeSection (dashboard) — returns just array
export async function fetchAllBikes(): Promise<Bike[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/bike`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.bikes ?? [];
  } catch (err) {
    console.error("fetchAllBikes error:", err);
    return [];
  }
}

// ✅ For /bikes page — returns bikes + pagination
export async function fetchBikesPaginated(
  page: number = 1,
  size: number = 9,
  search?: string
): Promise<PaginatedBikes> {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (search) params.set("search", search);

    const res = await fetch(`${BASE_URL}/api/bike?${params.toString()}`, { // ✅ /api/bike
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch bikes");

    const data = await res.json();
    return {
      bikes: data.bikes ?? [],
      pagination: data.pagination ?? {
        page,
        size,
        totalItems: 0,
        totalPages: 0,
      },
    };
  } catch (err) {
    console.error("fetchBikesPaginated error:", err);
    return {
      bikes: [],
      pagination: { page, size, totalItems: 0, totalPages: 0 },
    };
  }
}

// ✅ Fix in lib/actions/bike.action.ts
export async function fetchBikeById(id: string): Promise<Bike | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/bike/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.bike ?? null; // ✅ unwrap { bike: ... }
  } catch (err) {
    console.error("fetchBikeById error:", err);
    return null;
  }
}