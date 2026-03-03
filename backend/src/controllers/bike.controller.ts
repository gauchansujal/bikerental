import {Request, Response} from "express";
import { BikeService } from "../services/bike.services";

const bikeService = new BikeService();

// get all bikes (public)



export const getAllBikes = async (req: Request, res: Response) => {
  try {
    const { page, size, search } = req.query; // ✅ extract query params

    const result = await bikeService.getAllBikes(
      page as string,
      size as string,
      search as string
    );

    res.status(200).json(result); // ✅ returns { bikes, pagination }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bikes" });
  }
};

// ✅ Add this - consistent with your other functions
export const getBikeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // ✅ Guard against undefined
    if (!id) {
      return res.status(400).json({ message: "Bike ID is required" });
    }

    const bike = await bikeService.getBikeById(id); // now TypeScript knows id is string
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    return res.status(200).json({ bike });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bike" });
  }
};
//get all bikes by name (public)

// Get bike by name (PUBLIC)
// =======================
export const getBikeByName = async (req: Request, res: Response) => {
  try {
    const bike = await bikeService.getBikeByName(req.params.name as string);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res.status(200).json(bike);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bike" });
  }
};
  //creatt bike (Admin)

  export const createBike = async (req:Request, res: Response)=>{
    try{

        const data = req.body;
        //attcj image url if file is uplodaed
        if(req.file){
            data.imageUrl =`/uploads/${req.file.filename}`;
        }
        const bike = await bikeService.createBike(req.body,req.user?.role); //role from auth middleware)
res.status(201).json(bike);

    }catch (error: any){
        res.status(403).json({message: error.message});
    }
  };
export const updateBike = async (req: Request, res: Response) => {
  try {
    const data: any = {};

    // ✅ Only include fields that are actually provided
    if (req.body.name) data.name = req.body.name;
    if (req.body.brand) data.brand = req.body.brand;
    if (req.body.engineCC) data.engineCC = Number(req.body.engineCC);
    if (req.body.price) data.price = Number(req.body.price);
    if (req.body.milage) data.milage = req.body.milage;
    if (req.body.isAvilable !== undefined) data.isAvilable = req.body.isAvilable === 'true';

    // ✅ Attach image url if file uploaded
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const bike = await bikeService.updateBike(
      req.params.id as string,
      data,
      req.user?.role
    );

    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    res.status(200).json(bike);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

//    =======================
// Delete bike (ADMIN)
// =======================
export const deleteBike = async (req: Request, res: Response) => {
  try {
    const success = await bikeService.deleteBike(
      req.params.id as string,
      req.user?.role
    );

    if (!success) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res.status(200).json({ message: "Bike deleted successfully" });
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

