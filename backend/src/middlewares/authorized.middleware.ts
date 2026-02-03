import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';
import { Iuser } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../errors/http-error';

const userRepository = new UserRepository();

// Extend Express Request globally (this is correct – keep it here)
declare global {
    namespace Express {
        interface Request {
            user?: Iuser | Record<string, any>;
        }
    }
}

export const authorizationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new HttpError(401, 'Unauthorized: Invalid JWT format');
        }

        const token = authHeader.split(' ')[1]; // Bearer <token> → take index 1

        if (!token) {
            throw new HttpError(401, 'Unauthorized: JWT token missing');
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as Record<string, any>;

        if (!decodedToken || !decodedToken.id) {
            throw new HttpError(401, 'Unauthorized: JWT invalid or no id');
        }

        const user = await userRepository.getUserById(decodedToken.id);

        if (!user) {
            throw new HttpError(401, 'Unauthorized: User not found');
        }

        req.user = user; // attach to request
        next();
    } catch (err: any) {
        return res.status(err.statusCode || 401).json({
            success: false,
            message: err.message || 'Unauthorized',
        });
    }
};

export const adminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new HttpError(401, 'Unauthorized: No user information');
        }

        if (req.user.role !== 'admin') {
            throw new HttpError(403, 'Forbidden: Admin access required');
        }

        return next();
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Server error',
        });
    }
};