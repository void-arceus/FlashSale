// flashsaleService.ts
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import type { IFlashSale } from "../../admin/pages/ScheduleSaleForm";

export const ScheduleSale = async (
    data: any,
): Promise<{
    status: boolean;
    message: string;
    data?: IFlashSale[];
}> => {
    try {
        const res = await axios.post(`${BASE_URL}/sale/flashsale`, data);
        const message =
            res.data?.data?.message || "Sale Scheduled Successfully";
        return {
            status: true,
            message: message,
            data: res.data.data,
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

export const getAdminSales = async (
    id: string,
): Promise<{
    status: boolean;
    message?: string;
    data?: IFlashSale[];
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/sale/mySales/${id}`);
        console.log("I am here:", res.data.data);
        return {
            status: true,
            data: res.data.data as IFlashSale[],
        };
    } catch (error: any) {
        const message = error.response?.data?.message;
        return {
            status: false,
            message: message,
        };
    }
};

export const getSales = async (): Promise<{
    status: boolean;
    message: string;
    data?: IFlashSale[];
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/sale/sales`);
        const message = res.data?.data?.message || "Sales fetched successfully";
        return {
            status: true,
            message: message,
            data: res.data.data,
        };
    } catch (error: any) {
        const message =
            error.respones?.data?.message || "Something went wrong!";
        return { status: false, message: message };
    }
};

export const deleteSale = async (
    id: string,
): Promise<{
    status: boolean;
    message: string;
}> => {
    try {
        await axios.delete(`${BASE_URL}/sale/delete/${id}`);
        return {
            status: true,
            message: "Sale deleted Successfully",
        };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Something went wrong!";
        return {
            status: false,
            message: message,
        };
    }
};

export const updateSale = async (
    id: string,
    data: any,
): Promise<{
    status: boolean;
    message: string;
    data?: any;
}> => {
    try {
        const res = await axios.patch(`${BASE_URL}/sale/update/${id}`, data);
        console.log("Updated data:", data);
        const message = "Sale updated successfully!";
        return { status: true, message: message, data: res.data.data };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Failed to update sale!";
        return { status: false, message: message };
    }
};

export const getSaleDetail = async (
    id: string,
): Promise<{
    status: boolean;
    message: string;
    data?: IFlashSale;
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/sale/sales/${id}`);
        return {
            status: true,
            message: "Product details fetched!",
            data: res.data.data,
        };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Something went wrong!";
        return {
            status: false,
            message: message,
        };
    }
};
