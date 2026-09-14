import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function purchaseFlashSaleProduct(id: string) {
    try {
        const res = await axios.post(`${BASE_URL}/purchase/salePurchase/${id}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}
