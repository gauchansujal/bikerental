import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizationMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/uplode.middlewares";
const router = Router();
const controller = new AuthController();
let authController = new AuthController();
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/whoami", authorizationMiddleware, authController.getProfile);
router.post("/requestresetPassword", authController.sendResetPasswordEmail);
router.post("/reset-password/:token", authController.resetPassword);

router.put(
    "/update-profile",
    authorizationMiddleware,
    uploads.single("image"), // "image" - field name from frontend/client
    authController.updateProfile
)

export default router;
