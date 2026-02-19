import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authorizationMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const controller = new BookingController();

router.get("/", authorizationMiddleware, controller.getAll.bind(controller));
router.get("/:id", authorizationMiddleware, controller.getById.bind(controller));
router.post("/", authorizationMiddleware, controller.create.bind(controller));
router.put("/:id", authorizationMiddleware, controller.update.bind(controller));
router.delete("/:id", authorizationMiddleware, controller.delete.bind(controller));

export default router;