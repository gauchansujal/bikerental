"use client";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {forgetPasswordSchema, ForgetPasswordData} from "../schema";
import {zodResolver} from "@hookform/resolvers/zod";

import Link from "next/link";
import {handleRequestPasswordReset} from "@/lib/actions/auth-action";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";


const ForgetPasswordForm=()=>{
    const router = useRouter();
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<ForgetPasswordData>({
        mode: "onSubmit",
        resolver: zodResolver(forgetPasswordSchema),

    });

    const [error, setError] = useState<string | null>(null);
    const [pending, setTransition] = useTransition();
    const submit = (value: ForgetPasswordData)=>{
        setError(null);
        setTransition(async()=>{
            try{
                const result =await handleRequestPasswordReset(value.email);
                if(result.success){
                    toast.success("If the email registered, a reset link has been sent.");
                    return router.push("/auth/login");
                }else{
                    throw new Error( result.message || 'failed to send resent link');
                }
            }catch (err: Error | any){
                toast.error(err.message|| 'Failed to send reset link');
            }
        })
    }
    return (
        <form onSubmit = {handleSubmit(submit)} className="space-y-4">
            {error && (
                <p className ="text-sm text-read-600">{error}</p>
            )}
            <div className = "space-y-1">
                <label className ="text-sm font-medium" htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" className="h-10 w-full rounded-md border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40" {...register("email")}placeholder="you@example.com"/>
                {errors.email?.message && (<p className="text-xs text-red-600">{errors.email.message}</p>)}


            </div>
            <button type="submit" 
            disabled={isSubmitting || pending}
            className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60">
                {isSubmitting || pending? "semding...": "send link"}
            </button>
            <div className="mt-1 text-center text-sm">
                Already have an account? <Link href="/auth/login" className="font-semibold hover:underline">Log in</Link>
            </div>
        </form>
    );

}

export default ForgetPasswordForm;