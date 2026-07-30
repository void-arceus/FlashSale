import type { IFlashSale } from "../models/flashsale.model";

export const validateSaleData = (
    data: IFlashSale,
): { status: boolean; message?: string } => {
    try {
        if (!data?.flashSalePrice || data?.flashSalePrice < 0) {
            return { status: false, message: "Invalid Sale Price" };
        }
        // validate start date
        if (!data?.flashSaleStartTime)
            return { status: false, message: "Sale start time is required!" };
        if (new Date(data?.flashSaleStartTime) < new Date()) {
            return {
                status: false,
                message: "Start date cannot be in past",
            };
        }
        if (!data?.flashSaleEndTime) {
            return { status: false, message: "Sale End Time is required" };
        }
        if (
            new Date(data?.flashSaleEndTime) <=
            new Date(data?.flashSaleStartTime)
        ) {
            return { status: false, message: "Invalid Sale end time" };
        }
        return { status: true };
    } catch (error: any) {
        return { status: false, message: "Something went wrong" };
    }
};
