// import { Request, Response, NextFunction } from 'express';

// export const validateMongoIdParam = (paramName = 'id') =>
//   (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params[paramName];

//     if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid ID format – expected 24-character hex string',
//       });
//     }

//     next();
//   };