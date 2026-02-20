import api from "../api/axios"; // axios instance
import { API } from "../api/endpoints"; // endpoints

// ✅ DL Type
export type DL = {
  _id?: string;
  drivingLicense: string;
  drivingLicenseImageUrl: string;
  nationalId: string;
  nationalIdImageUrl: string;
  phoneNumber: string;
  fullname: string;
};

export const createDL = async (data: FormData) => {
  for (const [key, value] of data.entries()) {
    console.log(key, value); // inspect all fields
  }
  const res = await api.post(API.DL.CREATE, data);
  return res.data;
};
// ✅ GET ALL DL
export const fetchAllDL = async (): Promise<DL[]> => {
  try {
    const res = await api.get(API.DL.GET_ALL);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching DL:", err);
    throw err;
  }
};