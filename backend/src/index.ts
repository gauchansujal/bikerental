import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './database/mongodb';
import { PORT } from './config';
import authRoutes from './routes/auth.routes';
import cors from 'cors';

import { HttpError } from './errors/http-error';


import adminUserRoutes from "./routes/admin/user.admin";
import { Admin } from 'mongodb';

const app: Application = express();

const corsOptions = {
    origin:[ 'http://localhost:3000', 'http://localhost:3003', 'http://localhost:3005' ],
    optionsSuccessStatus: 200,
    credentials: true,
    httpOnly : true,
    

};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/admin/user', adminUserRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: true, message: "Welcome to the API" });
});
app.use((err: Error, req: Request, res: Response, next: Function) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});



async function startServer() {
    try {
        await connectDB();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();