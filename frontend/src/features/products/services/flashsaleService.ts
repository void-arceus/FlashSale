// flashsaleService.ts
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const ScheduleSale = async (
    data: any,
): Promise<{
    status: boolean;
    message: string;
}> => {
    try {
        const res = await axios.post(`${BASE_URL}/sale/flashsale`, data);
        const message =
            res.data?.data?.message || "Sale Scheduled Successfully";
        return {
            status: true,
            message: message,
        };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Failed to schedule Sale!";
        return {
            status: false,
            message: message,
        };
    }
};

export const getAdminSales = async (): Promise<{
    status: boolean;
    message?: string;
    data?: any;
}> => {
    try {
        return {
            status: true,
        };
    } catch (error: any) {
        const message = error.response?.data?.message;
        return {
            status: false,
            message: message,
        };
    }
};
