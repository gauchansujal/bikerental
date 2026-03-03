
import z from "zod";
export const BikeSchema = z.object({
    name : z.string().min(1, "Bike name is required"),
    brand : z.string().min(1, "brand name is required"),
    price: z.string().min(1000, "Price should be higeher than 1k"),
    engineCC : z.number().min(100, "higher than 100cc "),
    milage: z.string(),
    isAvailable:z.boolean().default(true),//default true
    imageUrl: z.string().url().optional(), //optional image url

});
export type BikeType = z.infer<typeof BikeSchema>;