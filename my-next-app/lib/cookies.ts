"use server"

import { cookies } from "next/headers"

interface UserData {
    _id: string;
    email: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

export const setAuthToken = async (token: string) => {
    try {
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    } catch (error) {
        console.error('Error setting auth token:', error);
    }
}

export const getAuthToken = async (): Promise<string | null> => {
    try {
        const cookieStore = await cookies();
        return cookieStore.get('auth_token')?.value || null;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

export const setUserData = async (userData: UserData) => {
    try {
        const cookieStore = await cookies();
        cookieStore.set('user_data', JSON.stringify(userData), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    } catch (error) {
        console.error('Error setting user data:', error);
    }
}

export const getUserData = async (): Promise<UserData | null> => {
    try {
        const cookieStore = await cookies();
        const userData = cookieStore.get('user_data')?.value || null;
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

export const clearAuthCookies = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');
        cookieStore.delete('user_data');
    } catch (error) {
        console.error('Error clearing auth cookies:', error);
    }
}