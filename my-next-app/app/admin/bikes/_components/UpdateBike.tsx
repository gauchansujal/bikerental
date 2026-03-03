"use client";
import { Controller, useForm } from "react-hook-form";
import { BikeData, BikeEditSchema } from "@/app/admin/bikes/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleUpdateBike } from "@/lib/actions/admin/bike.action";
import Image from "next/image";

export default function EditBikeForm(
    { bike }: { bike: any }
) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<Partial<BikeData>>({
        resolver: zodResolver(BikeEditSchema), // ✅ Use BikeEditSchema for edit
        defaultValues: {
            name: bike.name || '',
            brand: bike.brand || '',
            engineCC: bike.engineCC || '',
            price: bike.price?.toString() || '',
            milage: bike.milage || '',
            isAvailable: bike.isAvilable || false,
            image: undefined,
        }
    });

    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: Partial<BikeData>) => {
        setError(null);
        startTransition(async () => {
            try {
                const formData = new FormData();
                if (data.name) {
                    formData.append('name', data.name);
                }
                if (data.brand) {
                    formData.append('brand', data.brand);
                }
                if (data.engineCC) {
                    formData.append('engineCC', data.engineCC);
                }
                if (data.price) {
                    formData.append('price', data.price);
                }
                if (data.milage) {
                    formData.append('milage', data.milage);
                }
                if (data.isAvailable !== undefined) {
                    formData.append('isAvailable', String(data.isAvailable));
                }
                if (data.image) {
                    formData.append('image', data.image);
                }

                const response = await handleUpdateBike(bike._id, formData);

                if (!response.success) {
                    throw new Error(response.message || 'Update bike failed');
                }
                reset();
                handleDismissImage();
                toast.success('Bike updated successfully');
                router.push(`/admin/bikes/${bike._id}`);

            } catch (error: Error | any) {
                toast.error(error.message || 'Update bike failed');
                setError(error.message || 'Update bike failed');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Bike Image Display */}
            <div className="mb-4">
                {previewImage ? (
                    <div className="relative w-32 h-24">
                        <img
                            src={previewImage}
                            alt="Bike Image Preview"
                            className="w-32 h-24 rounded object-cover"
                        />
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <button
                                    type="button"
                                    onClick={() => handleDismissImage(onChange)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    bike.imageUrl ? (
                        <div className="relative w-32 h-24">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${bike.imageUrl}`}
                                alt="Bike Image"
                                className="w-32 h-24 rounded object-cover"
                                width={128}
                                height={96}
                            />
                        </div>
                    ) : (
                        <div className="w-32 h-24 bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-gray-600">No Image</span>
                        </div>
                    )
                )}
            </div>

            {/* Bike Image Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Bike Image</label>
                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                            accept=".jpg,.jpeg,.png,.webp"
                            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                        />
                    )}
                />
                {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
            </div>

            {/* Name & Brand */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="name">Name</label>
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
                    <label className="text-sm font-medium" htmlFor="brand">Brand</label>
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
                    <label className="text-sm font-medium" htmlFor="price">Price</label>
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
                    <label className="text-sm font-medium" htmlFor="engineCC">Engine CC</label>
                    <input
                        id="engineCC"
                        type="text"
                        className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                        {...register("engineCC")}
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
                    <label className="text-sm font-medium" htmlFor="milage">Mileage</label>
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
                {isSubmitting || pending ? "Updating bike..." : "Update bike"}
            </button>
        </form>
    );
}