import z from "zod";

export const DLSchema = z.object({
  drivingLicense: z.string().regex(/^\d{2}-\d{2}-\d{8}$/, "License number must follow 01-06-01234567 format"),  
  drivingLicenseImageUrl: z.string().min(1, "License image is required"),
  nationalId: z.string().regex(/^\d{2}-\d{2}-\d{2}-\d{5}$/, "National ID must be at least 16 digits"),
  nationalIdImageUrl: z.string().min(1, "National ID image is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  fullname: z.string().min(1, "Full name is required"),
});

export type DLType = z.infer<typeof DLSchema>;
