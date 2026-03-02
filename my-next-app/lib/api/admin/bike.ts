import { API } from "../endpoints";
import axios from "../axios";

export const createBike = async (bikeData: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.BIKES.CREATE,
            bikeData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create bike failed');
    }
}

export const updateBike = async (id: string, updateData: any) => {
    try {
        const response = await axios.put(
            API.ADMIN.BIKES.UPDATE(id),
            updateData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Update bike failed');
    }
}

export const deleteBike = async (id: string) => {
    try {
        const response = await axios.delete(
            API.ADMIN.BIKES.DELETE(id)
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Delete bike failed');
    }
}

// export const getAllBikes = async (
//     page: number, size: number, search?: string
// ) => {
//     try {
//         const response = await axios.get(
//             API.ADMIN.BIKES.GET_ALL,
//             {
//                 params: { page, size, search }
//             }
//         );
//         return response.data;
//     } catch (error: Error | any) {
//         throw new Error(error.response?.data?.message
//             || error.message || 'Get all bikes failed');
//     }
// }

// export const getBikeById = async (id: string) => {
//     try {
//         const response = await axios.get(
//             API.ADMIN.BIKES.GET_ONE(id)
//         );
//         return response.data;
//     } catch (error: Error | any) {
//         throw new Error(error.response?.data?.message
//             || error.message || 'Get bike by id failed');
//     }
