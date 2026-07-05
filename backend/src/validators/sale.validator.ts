export const validateSaleData = (
    data: object,
): { status: boolean; message?: string } => {
    try {
        /* 
            - validate product id 
            - validate admin id 
*/
        return { status: true };
    } catch (error: any) {
        return { status: false, message: "Something went wrong" };
    }
};
