import type { IFlashSale } from "../models/flashsale.model";

export const validateSaleData = (
    data: IFlashSale,
): { status: boolean; message?: string } => {
    try {
        if (
            !data?.originalPrice ||
            data?.originalPrice < 0 ||
            data?.originalPrice < data?.salePrice
        ) {
            return { status: false, message: "Invalid Original Price" };
        }

        if (!data?.salePrice || data?.salePrice < 0) {
            return { status: false, message: "Invalid Sale Price" };
        }

        // validate start date
        if (!data?.saleStartTime)
            return { status: false, message: "Sale start time is required!" };
        if (new Date(data?.saleStartTime) < new Date()) {
            return {
                status: false,
                message: "Start date cannot be in past",
            };
        }
        if (!data?.saleEndTime) {
            return { status: false, message: "Sale End Time is required" };
        }
        if (new Date(data?.saleEndTime) <= new Date(data?.saleStartTime)) {
            return { status: false, message: "Invalid Sale end time" };
        }
        return { status: true };
    } catch (error: any) {
        return { status: false, message: "Something went wrong" };
    }
};
