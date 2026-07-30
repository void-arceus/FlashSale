import cart from "../assets/cart.svg";
import type { IProduct } from "../features/products/services/productService";

interface GeneralCardProps {
    product: IProduct;
}

function GeneralProductCard({ product }: GeneralCardProps) {
    return (
        <div className="w-full max-h-120 border border-border rounded-xl p-4 flex flex-col items-start justify-between gap-2 shadow-md">
            <div className="h-fit w-full overflow-hidden rounded-xl">
                {/* image */}
                <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="h-70 w-full object-center object-cover rounded-xl hover:scale-106 transition-transform duration-300"
                />
            </div>
            <div className="flex flex-col items-start justify-center gap-1">
                <p className="text-md font-semibold text-text-main">
                    {product.productName}
                </p>
                <p className="text-sm font-medium text-text-muted leading-normal line-clamp-2">
                    {product.productDescription}
                </p>
            </div>
            <div className="w-full flex items-center justify-start gap-3">
                <h2 className="text-md font-medium text-text-main">Price:</h2>
                <p className="text-md font-medium text-text-body">
                    {product.productOriginalPrice}
                </p>
            </div>
            <div className="w-full flex items-center justify-between ">
                <div className="w-full flex items-center justify-start">
                    <button className="font-semibold text-sm text-text-muted hover:cursor-pointer hover:underline">
                        view details
                    </button>
                </div>
                <div className="w-full flex items-center justify-end gap-2">
                    <button className="bg-primary-bg border border-border px-4 py-1.5 rounded-lg hover:cursor-pointer active:scale-[0.96] transition-all duration-100 ease-in shadow-xs hover:shadow-sm">
                        <img src={cart} className="h-5" />
                    </button>
                    <button className="bg-btn-primary px-4 py-1.5 hover:bg-btn-hover hover:cursor-pointer rounded-lg font-medium text-btn-text active:scale-[0.96] transition-all duration-100 ease-in shadow-xs hover:shadow-sm">
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GeneralProductCard;
