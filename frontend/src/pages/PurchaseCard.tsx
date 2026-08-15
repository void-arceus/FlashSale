import type { IProduct } from "../features/products/services/productService";

interface PurchaseCardProps {
    product: IProduct;
}

function PurchaseCard({ product }: PurchaseCardProps) {
    return (
        <div className="absolute h-[85vh] w-full bg-transparent p-4 flex items-center justify-center">
            <div className="border hover:border-border-hover bg-primary-bg p-4 rounded-xl">
                {product?.productName}
            </div>
        </div>
    );
}

export default PurchaseCard;
