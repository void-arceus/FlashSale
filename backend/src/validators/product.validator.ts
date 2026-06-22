// product.validator.ts

export const validateProductInfo = (
    productName: string,
    description: string,
    quantity: number,
    originalPrice: number,
    salePrice: number,
    category: string,
    saleStartTime: Date,
    saleEndTime: Date,
) => {
    try {
        if (!productName || productName.trim() === "")
            return { status: false, message: "Product name not provided" };
        if (!description || description.trim() === "")
            return { status: false, message: "Description not provided" };
        if (quantity === undefined || quantity < 0)
            return {
                status: false,
                message: "Invalide or Quantity not provided",
            };
        if (originalPrice === undefined || originalPrice < 0)
            return {
                status: false,
                message: "Invalid or Original Price not provided",
            };
        if (salePrice === undefined || salePrice < 0)
            return {
                status: false,
                message: "Invalid or Sale Price not provided",
            };
        if (!category || category.trim() === "")
            return { status: false, message: "Product category not provided" };
        if (!saleStartTime || !saleEndTime)
            return {
                status: false,
                message: "Sale start or end time not provided",
            };

        // validating dates
        const start = new Date(saleStartTime).getTime();
        const end = new Date(saleEndTime).getTime();

        if (isNaN(start) || isNaN(end)) {
            return { status: false, message: "Invalid date format" };
        }

        if (start < Date.now()) {
            return {
                status: false,
                message: "Start time cannot be in the past",
            };
        }

        if (start >= end) {
            return {
                status: false,
                message: "Invalid Sale start and end time",
            };
        }
        return { status: true, message: "Data Validated!" };
    } catch (error: any) {
        console.error(error.message);
        return { status: false, message: "Something went wrong" };
    }
};
