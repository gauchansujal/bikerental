import { z } from "zod";

export const BikeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    brand: z.string().min(1, "Brand is required"),
    price: z.string().min(1, "Price is required"),
    engineCC: z.string().min(1, "Engine CC is required"),
    milage: z.string().min(1, "Mileage is required"),
    isAvailable: z.boolean().optional(),
    image: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024,
            "Image must be less than 5MB"
        )
        .refine(
            (file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            "Only .jpg, .png, .webp formats are supported"
        ),
});
export const BikeEditSchema = BikeSchema.partial();


export type BikeData = z.infer<typeof BikeSchema>;
export type BikeEditData = z.infer<typeof BikeEditSchema>;