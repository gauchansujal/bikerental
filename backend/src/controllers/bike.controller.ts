import {Request, Response} from "express";
import { BikeService } from "../services/bike.services";

const bikeService = new BikeService();

// get all bikes (public)

export const getAllBikes = async(req: Request, res: Response)=>{
    try{
        const bikes = await bikeService.getAllBikes();
        res.status(200).json(bikes);

    }catch (error){
        res.status(500).json({message: "failed to fetch bikes"});
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

  //update bike (admin)
  export const updateBike = async (req:Request, res: Response) =>{
    try{
        const bike = await bikeService.updateBike(req.params.id as string, req.body, req.user?.role);
        if(!bike){
            return res.status(404).json({message: 'Bike not found'});
        }res.status(200).json(bike);


    }catch(error:any){res.status(403).json({message: error.message});

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

