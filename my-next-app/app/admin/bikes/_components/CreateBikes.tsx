"use client";
import { Controller, useForm } from "react-hook-form";
import { BikeData, BikeSchema } from "@/app/admin/bikes/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleCreateBike } from "@/lib/actions/admin/bike.action";

export default function CreateBikeForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<BikeData>({
        resolver: zodResolver(BikeSchema),
        defaultValues: { isAvailable: true },
    });
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (
        file: File | undefined,
        onChange: (file: File | undefined) => void
    ) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (data: BikeData) => {
        setError(null);
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("brand", data.brand);
                formData.append("price", data.price);
                formData.append("engineCC", String(data.engineCC));
                formData.append("milage", data.milage);
                formData.append("isAvailable", String(data.isAvailable));
                if (data.image) formData.append("image", data.image);

                const result = await handleCreateBike(formData);

                if (!result.success) {
                    toast.error(result.message || "Failed to create bike");
                    setError(result.message || "Failed to create bike");
                    return;
                }

                reset();
                setPreviewImage(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                toast.success("Bike created successfully");
                router.push("/admin/bikes");
            } catch (error: Error | any) {
                toast.error(error.message || "Create bike failed");
                setError(error.message || "Create bike failed");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Controller
                name="image"
                control={control}
                render={({ field: { onChange, ref } }) => (
                    <div className="space-y-2">
                        {/* Image Preview */}
                        <div className="mb-2">
                            {previewImage ? (
                                <div className="relative w-32 h-24">
                                    <img
                                        src={previewImage}
                                        alt="Bike Preview"
                                        className="w-32 h-24 rounded object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDismissImage(onChange)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="w-32 h-24 bg-gray-300 rounded flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* File Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Bike Image
                            </label>
                            <input
                                ref={(e) => {
                                    ref(e);
                                    fileInputRef.current = e;
                                }}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) =>
                                    handleImageChange(e.target.files?.[0], onChange)
                                }
                                className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                            />
                            {errors.image && (
                                <p className="text-sm text-red-600">{errors.image.message}</p>
                            )}
                        </div>
                    </div>
                )}
            />

            {/* Name & Brand */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                        {...register("name")}
                        placeholder="Honda CBR 600"
                    />
                    {errors.name?.message && (
                        <p className="text-xs text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="brand">
                        Brand
                    </label>
                    <input
                        id="brand"
                        type="text"
                        className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                        {...register("brand")}
                        placeholder="Honda"
                    />
                    {errors.brand?.message && (
                        <p className="text-xs text-red-600">{errors.brand.message}</p>
                    )}
                </div>
            </div>

            {/* Price & Engine CC */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="price">
                        Price
                    </label>
                    <input
                        id="price"
                        type="text"
                        className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                        {...register("price")}
                        placeholder="$5,000"
                    />
                    {errors.price?.message && (
                        <p className="text-xs text-red-600">{errors.price.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="engineCC">
                        Engine CC
                    </label>
                    <input
                        id="engineCC"
                        type="number"
                        className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                        {...register("engineCC", { valueAsNumber: true })}
                        placeholder="600"
                    />
                    {errors.engineCC?.message && (
                        <p className="text-xs text-red-600">{errors.engineCC.message}</p>
                    )}
                </div>
            </div>

            {/* Mileage & Availability */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="milage">
                        Mileage
                    </label>
                    <input
                        id="milage"
                        type="text"
                        className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                        {...register("milage")}
                        placeholder="30 km/l"
                    />
                    {errors.milage?.message && (
                        <p className="text-xs text-red-600">{errors.milage.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Available</label>
                    <div className="flex items-center h-10">
                        <input
                            id="isAvailable"
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300"
                            {...register("isAvailable")}
                        />
                        <label
                            htmlFor="isAvailable"
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                            In Stock
                        </label>
                    </div>
                    {errors.isAvailable?.message && (
                        <p className="text-xs text-red-600">{errors.isAvailable.message}</p>
                    )}
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
                {isSubmitting || pending ? "Creating bike..." : "Create bike"}
            </button>
        </form>
    );
}