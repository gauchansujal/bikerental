"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema"; // adjust path if needed
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: RegisterData) => {
    setServerError(null);

    startTransition(async () => {
      // Remove confirmPassword before sending to the server
      const {  ...registerData } = values;

      try {
        const response = await handleRegister(registerData);

        if (!response?.success) {
          throw new Error(response?.message || "Registration failed");
        }

        // Optional: you could redirect to dashboard if auto-login happens
        router.push("/auth/login");
      } catch (err: any) {
        setServerError(err.message || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {serverError}
        </p>
      )}

      {/* First Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="firstname">
          First Name
        </label>
        <input
          id="firstname"
          type="text"
          autoComplete="given-name"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("firstname")}
          placeholder="John"
        />
        {errors.firstname && (
          <p className="text-xs text-red-600">{errors.firstname.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="lastname">
          Last Name
        </label>
        <input
          id="lastname"
          type="text"
          autoComplete="family-name"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("lastname")}
          placeholder="Doe"
        />
        {errors.lastname && (
          <p className="text-xs text-red-600">{errors.lastname.message}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("username")}
          placeholder="johndoe"
        />
        {errors.username && (
          <p className="text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("email")}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("password")}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("confirmPassword")}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {isSubmitting || pending ? "Creating account..." : "Create account"}
      </button>

      <div className="mt-2 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-foreground font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
}