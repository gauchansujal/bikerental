import { Request, Response } from "express";
import { AuthService } from "../services/auth..services";
import { RegisterUserDto, LoginUserDto } from "../types/user.type";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const parsed = RegisterUserDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    try {
      const user = await authService.register(
        parsed.data.email,
        parsed.data.password,
        parsed.data.role
      );
      res.status(201).json({ message: "User registered", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    const parsed = LoginUserDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    try {
      const token = await authService.login(
        parsed.data.email,
        parsed.data.password
      );
      res.json(token);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
