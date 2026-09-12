import cart from "../assets/cart.svg";
import type { IProduct } from "../features/products/services/productService";

interface GeneralCardProps {
    product: IProduct;
    handleShowPurchaseCard: () => void;
}

function GeneralProductCard({
    product,
    handleShowPurchaseCard,
}: GeneralCardProps) {
    return (
        <div className="w-full max-w-80 max-h-100 border border-border rounded-xs p-2 flex flex-col items-start justify-between gap-3 shadow-md">
            <div className="h-fit w-full overflow-hidden rounded-xs">
                <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="h-70 w-full object-center object-cover rounded-xs hover:scale-106 transition-transform duration-300"
                />
            </div>
            <div className="flex flex-col items-start justify-center gap-1">
                <div className="w-full flex items-center justify-between">
                    <p className="text-sm font-bold text-text-body">
                        {product.productName}
                    </p>
                    <div className="flex items-center justify-start gap-1">
                        <h2 className="text-xs font-bold text-text-main">
                            Price:
                        </h2>
                        <p className="text-xs font-semibold text-text-body">
                            ₹&nbsp;
                            {product.productOriginalPrice.toLocaleString()}
                        </p>
                    </div>
                </div>
                <p className="text-xs font-medium text-text-muted line-clamp-2">
                    {product.productDescription}
                </p>
            </div>
            <div className="w-full flex items-center justify-between ">
                <div className="w-full flex items-center justify-start">
                    <button className="font-semibold text-xs text-text-muted hover:cursor-pointer hover:underline hover:text-text-body">
                        view details
                    </button>
                </div>
                <div className="w-full flex items-center justify-end gap-2">
                    <button className="bg-primary-bg border border-border px-4 py-2 rounded-xs hover:cursor-pointer active:scale-[0.96] shadow-xs hover:shadow-sm">
                        <img src={cart} className="h-4" />
                    </button>
                    <button
                        // onClick={() => handleShowPurchaseCard()}
                        className="bg-btn-primary px-4 py-2 hover:bg-btn-hover hover:cursor-pointer rounded-xs font-semibold text-btn-text text-xs  active:scale-[0.96] shadow-xs hover:shadow-md"
                    >
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GeneralProductCard;
