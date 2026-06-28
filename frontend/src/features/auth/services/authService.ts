// authService.ts

import axios from "axios";
import type { userDataType } from "../../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (data: object): Promise<any> => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, data);
        const message = res.data.message || "Logged in Successfully";
        return { status: true, message: message, data: res.data.data };
    } catch (error: any) {
        const message = error.response?.data?.message || "Login failed";
        return { status: false, message: message };
    }
};

export const getCurrentUser = async (): Promise<{
    status: boolean;
    message?: string;
    data?: userDataType;
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/auth/me`);
        if (res.data.status === false) {
            return { status: false };
        }
        return { status: true, data: res.data.data };
    } catch (error: any) {
        return {
            status: false,
            message: "No user found",
        };
    }
};

export const register = async (data: object) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/register`, data);
        const message = res.data.message || "Account Created Successfully";
        return { status: true, message: message };
    } catch (error: any) {
        const message = error.response?.data?.message || "Registration Failed";
        return { status: false, message: message };
    }
};

export const logout = async () => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/logout`);
        const message = res.data?.message || "Logged out successfully";
        return { status: true, message: message };
    } catch (error: any) {
        const message = error.reponse?.data?.message || "Something went wrong!";
        return { status: false, message: message };
    }
};
