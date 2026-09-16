import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUserOrders(id: string) {
    try {
        const res = await axios.get(`${BASE_URL}/orders/${id}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error);
    }
}
