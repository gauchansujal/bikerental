import { Router } from "express";
import { uploads } from "../middlewares/uplode.middlewares";
import { createDL, getAllDL, updateDL, deleteDL, getDLById } from "../controllers/dl.controller";
import { authorizationMiddleware } from "../middlewares/authorized.middleware";
const router = Router();

// GET all licenses
router.get("/", getAllDL);
router.get("/:id", getDLById);

// CREATE license with two images
router.post(
  "/", authorizationMiddleware,
  uploads.fields([
    { name: "drivingLicenseImageUrl", maxCount: 1 },
    { name: "nationalIdImageUrl", maxCount: 1 },
  ]),
  createDL
);

// UPDATE license with optional two images
router.put(
  "/:id",
  uploads.fields([
    { name: "drivingLicenseImageUrl", maxCount: 1 },
    { name: "nationalIdImageUrl", maxCount: 1 },
  ]),
  updateDL
);

// DELETE license
router.delete("/:id", deleteDL);

export default router;
