import  api  from "../api/axios"; // your axios instance
import { API } from "../api/endpoints"; // your API endpoints

// Define Bike type
export type Bike = {
  _id: string;
  name: string;
  brand: string;
  price: string;
  engineCC: number;
  milage: string;
  isAvilable: boolean;
  imageUrl?: string;
};
// Fetch all bikes
export const fetchAllBikes = async (): Promise<Bike[]> => {
  try {
    const res = await api.get(API.BIKE.Get_ALL);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching bikes:", err);
    throw err;
  }
};
