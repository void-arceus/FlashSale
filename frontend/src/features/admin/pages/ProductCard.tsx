// ProductCard.tsx
import { deleteProduct } from "../../products/services/productService";
import { useConfirmation } from "../../../context/ConfirmationContext";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../../products/services/productService";

interface ProductCardProps {
    product: IProduct;
    handleReloadPage: () => void;
}

export default function ProductCard({
    product,
    handleReloadPage,
}: ProductCardProps) {
    const { showConfirmation } = useConfirmation();
    const { showToaster } = useToast();
    const navigate = useNavigate();

    const handleDeleteProduct = (id: string) => {
        try {
            const message =
                "Are you sure you want to delete this product. This Action can't be undone.";
            showConfirmation(message, () => deleteProductHandler(id));
        } catch (error: any) {
            console.log(error.message);
        }
    };
    const deleteProductHandler = async (id: string) => {
        const res = await deleteProduct(id);
        if (res.status === true) {
            handleReloadPage();
            showToaster(res.message, "success");
        } else {
            showToaster(res.message, "error");
        }
    };

    return (
        <div className="w-full max-w-80 max-h-120 border border-border rounded-xs p-2 flex flex-col items-start justify-between gap-4 shadow-md">
            <div className="h-fit w-full overflow-hidden rounded-xs">
                {/* image */}
                <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="h-70 w-full object-center object-cover rounded-xs hover:scale-106 transition-transform duration-300"
                />
            </div>
            <div className="">
                <div className="flex flex-col items-start justify-center gap-1">
                    <div className="w-full flex items-center justify-between">
                        <p className="text-sm font-semibold text-text-main">
                            {product.productName}
                        </p>
                        <div className="flex items-center gap-1">
                            <p className="text-xs font-bold text-text-main">
                                Price:
                            </p>
                            <p className="text-xs font-semibold text-text-muted">
                                ₹&nbsp;
                                {product?.productOriginalPrice.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs font-medium text-text-muted leading-normal line-clamp-2">
                        {product.productDescription}
                    </p>
                </div>
                <div></div>
            </div>
            <div className="w-full flex items-center justify-between ">
                <div className="w-full flex items-center justify-start">
                    <button className="font-semibold text-xs text-text-muted hover:cursor-pointer hover:text-text-main hover:underline">
                        view details
                    </button>
                </div>
                <div className="w-full flex items-center justify-end gap-2">
                    <button
                        onClick={() => {
                            navigate("/addProduct", {
                                state: { editing: true, product: product },
                            });
                        }}
                        className="bg-primary-bg border border-border px-4 py-2 rounded-xs hover:cursor-pointer text-xs font-semibold active:scale-[0.98] shadow-xs hover:shadow-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-btn-primary px-4 py-2 hover:bg-btn-hover hover:cursor-pointer rounded-xs font-semibold text-btn-text text-xs active:scale-[0.98] shadow-xs hover:shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
