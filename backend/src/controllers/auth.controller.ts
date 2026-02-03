import { UserService } from "../services/user.services";
import { CreateUserDTO, LoginUserDto, UpdateUserDto } from "../dots/user.dto";
import { Request, Response } from "express";
import z from "zod";

let userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const userData: CreateUserDTO = parsedData.data;
      const newUser = await userService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "user created",
        data: newUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const loginData: LoginUserDto = parsedData.data;
      const { token, user } = await userService.loginUser(loginData);

      return res.status(200).json({
        success: true,
        message: "login successful",
        data: user,
        token,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "internal server error",
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      // Type assertion - tells TS to trust that user exists
      const userId = (req as any).user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User Id Not found",
        });
      }

      const user = await userService.getUserById(userId);

      return res.status(200).json({
        success: true,
        data: user,
        message: "User profile fetched successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      // Type assertion for req.user
      const userId = (req as any).user?._id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User Id Not found",
        });
      }

      const parsedData = UpdateUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      // Type assertion for req.file (Multer adds it)
      if ((req as any).file) {
        parsedData.data.imageUrl = `/uploads/${(req as any).file.filename}`;
      }

      const updatedUser = await userService.updateUser(userId, parsedData.data);

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User profile updated successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}