import multer from "multer";
import { v4 as uuid } from "uuid";
import { Request } from "express";
import path from "path";
import { HttpError } from "../errors/http-error";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../../uploads/");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileSuffix = uuid();
        cb(null, fileSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new HttpError(400, 'Invalid file type, only images are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: fileFilter
});

export const uploads = {
    single: (fieldName: string) => upload.single(fieldName),
    array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
    fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray)
};

// import multer from "multer";
// import { v4 as uuid } from "uuid";
// import { Request, Response, NextFunction } from "express";
// import { HttpError } from "../errors/http-error";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Use memory storage - no disk needed
// const storage = multer.memoryStorage();

// const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new HttpError(400, 'Invalid file type, only images are allowed!'));
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 },
//     fileFilter: fileFilter
// });

// // Helper to upload buffer to Cloudinary
// export const uploadToCloudinary = (buffer: Buffer, mimetype: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             { folder: "bikerental", public_id: uuid() },
//             (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result!.secure_url);
//             }
//         );
//         uploadStream.end(buffer);
//     });
// };

// export const uploads = {
//     single: (fieldName: string) => upload.single(fieldName),
//     array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
//     fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray)
// };