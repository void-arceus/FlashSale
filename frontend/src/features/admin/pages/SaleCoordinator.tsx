import { useEffect, useState } from "react";
import { getAdminProducts } from "../../products/services/productService";
import type { Product } from "../../products/services/productService";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";

interface FlashSaleInput {
    productId: string;
    originalPrice: number;
    salePrice: number;
    saleStartTime: string;
    saleEndTime: string;
}

export default function SaleCoordinator() {
    // get the product names and original price
    const [products, setProducts] = useState<Product[] | null>(null);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FlashSaleInput>({
        defaultValues: {
            productId: "",
            originalPrice: undefined,
            salePrice: undefined,
            saleStartTime: "",
            saleEndTime: "",
        },
    });

    const watchProductId = watch("productId");
    const selectedProduct =
        products?.find((p) => p._id === watchProductId) || null;

    useEffect(() => {
        getProducts();
    }, []);

    const onSubmit: SubmitHandler<FlashSaleInput> = async (data) => {
        console.log("You form is being submitted", data);
    };

    const getProducts = async () => {
        if (user && user.role === "admin") {
            const res = await getAdminProducts(user.id);
            if (res.status === true) {
                setProducts(res.data as Product[]);
            } else {
                setProducts(null);
            }
        }
    };

    return (
        <main className="h-screen w-full pt-18 flex flex-col items-center gap-2">
            {/* header */}
            <section className="h-fit w-full max-w-6xl flex flex-col items-center justify-center gap-2 p-4">
                <h1 className="text-xl text-text-main font-semibold text-center">
                    Flash Sale Coordinator
                </h1>
                <p className="text-sm font-medium text-text-muted text-center">
                    Manage your timed store promotions and active countdowns
                    here.
                </p>
            </section>

            {/* start new sale and view on going or scheduled sales  */}
            <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                <div className="h-fit w-full border border-border rounded-xl p-3 flex flex-col items-center gap-4 shadow-lg">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full flex flex-col items-center gap-6"
                    >
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="w-full flex flex-col items-start gap-2">
                                <div className="w-full flex items-center justify-start gap-2">
                                    <label
                                        htmlFor="selectProduct"
                                        className="text-sm font-medium text-text-muted"
                                    >
                                        Select Product:
                                    </label>
                                    <select
                                        id="selectProduct"
                                        {...register("productId", {
                                            required: "Please select a product",
                                        })}
                                        className="border border-border p-2 rounded-lg text-sm text-text-main font-medium cursor-pointer"
                                    >
                                        <option value="">
                                            --Choose an item--
                                        </option>
                                        {products?.map((p) => (
                                            <option value={p._id} key={p._id}>
                                                {p.productName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors && (
                                    <p className="text-sm text-error font-medium">
                                        {errors.productId?.message}
                                    </p>
                                )}
                            </div>
                            {selectedProduct ? (
                                <div className="w-full flex items-center">
                                    <h2 className="text-sm text-text-main font-medium">
                                        Original Price:&nbsp;
                                    </h2>
                                    <p className="text-sm font-semibold text-text-muted">
                                        ₹{selectedProduct.originalPrice}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                        <div className="w-full flex sm:flex-row flex-col items-center justify-end gap-2">
                            <button
                                type="button"
                                className="border border-border px-4 py-2 rounded-lg bg-surface text-sm text-text-primary font-medium hover:cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-scale duration-200 ease-in-out"
                            >
                                Add New Product
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-btn-primary text-sm text-btn-text font-medium hover:cursor-pointer hover:bg-btn-hover shadow-md hover:shadow-lg active:scale-[0.98] transition-scale duration-200 ease-in-out">
                                Schedule Sale
                            </button>
                        </div>
                    </form>
                </div>
                <div className="h-fit w-full border border-border rounded-xl p-2 shadow-lg">
                    View ongoing and existing sales with timer
                </div>
            </section>
        </main>
    );
}
