// authService.ts

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (data: object): Promise<any> => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, data);
        const message = res.data.message || "Logged in Successfully";
        return { status: true, message: message };
    } catch (error: any) {
        const message = error.response?.data?.message || "Login failed";
        return { status: false, message: message };
    }
};
