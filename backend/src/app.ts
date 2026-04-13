import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import authRoutes from './routes/auth.routes';
import { HttpError } from './errors/http-error';
import bodyParser from 'body-parser';
import bikeRoutes from './routes/bike.routes';
import dlRoutes from "./routes/dl.routes";
import bookingRoutes from "./routes/booking.routes";
import notificationRoutes from "./routes/notification.routes"; 
import adminUserRoutes from "./routes/admin/user.admin";
import { Admin } from 'mongodb';


const app: Application = express();

const corsOptions = {
    origin:[ 'http://localhost:3000', 'http://localhost:3003', 'http://localhost:3005' /*  'https://bikerental-sable.vercel.app' */ ],
    optionsSuccessStatus: 200,
    credentials: true,
    httpOnly : true,
    
    

};
app.use(cors(corsOptions));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/admin/users', adminUserRoutes);

app.use('/api/auth', authRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/api/bike',bikeRoutes);
app.use('/api/notification/',notificationRoutes)
app.use('/api/dl', dlRoutes);
app.use('/api/booking',bookingRoutes);




app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ success: true, message: "Welcome to the API" });
});
app.use((err: Error, req: Request, res: Response, next: Function) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});
export default app;