import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
export const MONGODB_URL: string = process.env.MONGODB_URL!;
export const CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:3000';
export const EMAIL_USER: string = process.env.EMAIL_USER!;
export const EMAIL_PASS: string = process.env.EMAIL_PASS!;
export const JWT_SECRET: string = process.env.JWT_SECRET!;