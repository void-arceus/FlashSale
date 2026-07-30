// product.validator.ts

export const validateProductInfo = (
    productName: string,
    productDescription: string,
    productQuantity: number,
    productOriginalPrice: number,
    productCategory: string,
) => {
    try {
        if (!productName || productName.trim() === "")
            return { status: false, message: "Product name not provided" };
        if (!productDescription || productDescription.trim() === "")
            return { status: false, message: "Description not provided" };
        if (productQuantity === undefined || productQuantity < 0)
            return {
                status: false,
                message: "Invalide or Quantity not provided",
            };
        if (productOriginalPrice === undefined || productOriginalPrice < 0)
            return {
                status: false,
                message: "Invalid or Original Price not provided",
            };
        if (!productCategory || productCategory.trim() === "")
            return { status: false, message: "Product category not provided" };

        return { status: true, message: "Data Validated!" };
    } catch (error: any) {
        console.error(error.message);
        return { status: false, message: "Something went wrong" };
    }
};
