import {Router} from "express";
import { getAllBikes, getBikeByName, createBike, getBikeById,updateBike, deleteBike } from "../controllers/bike.controller";
import { authorizationMiddleware, adminMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/uplode.middlewares";
const router = Router();

//public (user+ admin)
router.get('/', getAllBikes );
router.get("/name/:name", getBikeByName); 
router.get("/:id", getBikeById);      
router.post('/',authorizationMiddleware, adminMiddleware, uploads.single("image"), createBike);
router.put('/:id',authorizationMiddleware,adminMiddleware, uploads.single("image"),updateBike);
router.delete('/:id', authorizationMiddleware, adminMiddleware, deleteBike);


export default router;