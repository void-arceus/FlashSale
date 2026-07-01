// ProductCard.tsx
import { useConfirmation } from "../../../context/ConfirmationContext";

export default function ProductCard({ product }: any) {
    const { showConfirmation } = useConfirmation();

    const handleDeleteProduct = (id: string) => {
        const message =
            "Are you sure you want to delete this product. This Action can't be undone.";
        showConfirmation(message, () => deleteProductHandler(id));
    };

    const deleteProductHandler = (id: string) => {
        console.log(`Your product with id ${id} has been deleted`);
    };

    return (
        <div className="w-full max-h-120 border border-border rounded-xl p-4 flex flex-col items-start gap-4 shadow-md">
            <div className="h-fit w-full overflow-hidden rounded-xl">
                {/* image */}
                <img
                    src={product.url}
                    alt={product.productName}
                    className="h-70 w-full object-center object-cover rounded-xl hover:scale-106 transition-transform duration-300"
                />
            </div>
            <div className="">
                <div className="flex flex-col items-start justify-center gap-1">
                    <p className="text-md font-semibold text-text-main">
                        {product.productName}
                    </p>
                    <p className="text-sm font-medium text-text-muted leading-normal line-clamp-2">
                        {product.description}
                    </p>
                </div>
                <div></div>
            </div>
            <div className="w-full flex items-center justify-between ">
                <div className="w-full flex items-center justify-start">
                    <button className="font-semibold text-sm text-text-muted hover:cursor-pointer hover:underline">
                        view details
                    </button>
                </div>
                <div className="w-full flex items-center justify-end gap-2">
                    <button className="bg-primary-bg border border-border px-4 py-1.5 rounded-lg hover:cursor-pointer active:scale-[0.98] transition-all duration-100 ease-in shadow-xs hover:shadow-sm">
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-btn-primary px-4 py-1.5 hover:bg-btn-hover hover:cursor-pointer rounded-lg font-medium text-btn-text active:scale-[0.98] transition-all duration-100 ease-in shadow-xs hover:shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
