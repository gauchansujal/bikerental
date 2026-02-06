"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const [error, setError] = useState<string | null>(null);

    const submit = async (values: LoginData) => {
        setError(null);

        try {
            const response = await handleLogin(values);

            if (!response.success) {
                setError(response.message || "Login failed");
                return;
            }

            // ✅ role-based redirect
            if (response.data?.role === "admin") {
                router.replace("/admin");
            } else {
                router.replace("/user/dashboard");
            }

        } catch (err: any) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("email")}
                    placeholder="you@example.com"
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("password")}
                    placeholder="••••••"
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
                {isSubmitting ? "Logging in..." : "Log in"}
            </button>

            <div className="mt-1 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-semibold hover:underline">
                    Sign up
                </Link>
            </div>
        </form>
    );
}
