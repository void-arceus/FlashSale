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
        reset,
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
    const watchStartTime = watch("saleStartTime");
    const selectedProduct =
        products?.find((p) => p._id === watchProductId) || null;

    useEffect(() => {
        getProducts();
    }, []);

    const onSubmit: SubmitHandler<FlashSaleInput> = async (data) => {
        console.log("You form is being submitted", data);
        // reset();
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
                        className="w-full flex flex-col items-center gap-4"
                    >
                        <h1 className="text-lg font-semibold text-text-main">
                            Schedule Sale
                        </h1>
                        <div className=" w-full flex flex-col sm:flex-row md:flex-col lg:flex-row  items-center justify-between gap-2">
                            <div className="w-full flex-2 flex flex-col items-start gap-2">
                                <div className="w-full flex items-center gap-2">
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
                                        className="border border-border p-1.5 rounded-lg text-sm text-text-main font-medium cursor-pointer"
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
                                <div className="flex-1 w-full flex items-start  justify-start gap-2">
                                    <h2 className="text-sm text-text-main font-medium">
                                        Original Price:&nbsp;
                                    </h2>
                                    <p className="text-sm font-semibold text-text-muted">
                                        ₹{selectedProduct.originalPrice}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        <div className="w-full flex flex-col items-start justify-center gap-2">
                            <div className="w-full flex items-center">
                                <label
                                    htmlFor="salePrice"
                                    className="text-sm text-text-muted font-semibold"
                                >
                                    Sale Price: &nbsp;
                                </label>
                                <input
                                    id="salePrice"
                                    type="number"
                                    {...register("salePrice", {
                                        required: "Sale Price is required",
                                        min: {
                                            value: 1,
                                            message:
                                                "Price must be greater than 0",
                                        },
                                        validate: (value) =>
                                            !selectedProduct ||
                                            Number(value) <
                                                selectedProduct?.originalPrice ||
                                            "Price must be less then original price",
                                    })}
                                    className="border border-border rounded-lg max-w-30 p-1.5 text-sm text-text-main font-medium outline-0 hover:border-border-hover focus:border-border-hover"
                                />
                            </div>
                            {errors && (
                                <p className="text-sm text-error font-medium">
                                    {errors.salePrice?.message}
                                </p>
                            )}
                        </div>

                        {/* sale timing */}
                        <div className="w-full flex flex-col items-start justify-center gap-2">
                            <div className="w-full flex items-center gap-2">
                                <label
                                    htmlFor="saleStartTime"
                                    className="text-sm font-medium text-text-muted"
                                >
                                    Sale Start Time:
                                </label>
                                <input
                                    id="saleStartTime"
                                    type="datetime-local"
                                    {...register("saleStartTime", {
                                        required:
                                            "Sale Start time is required!",
                                        validate: (value) => {
                                            return (
                                                new Date(value) > new Date() ||
                                                "Start time cannot be in past"
                                            );
                                        },
                                    })}
                                    className="border border-border rounded-lg p-1.5 cursor-pointer outline-0 hover:border-border-hover active:border-border-hover"
                                />
                            </div>
                            {errors && (
                                <p className="text-sm text-error font-medium">
                                    {errors.saleStartTime?.message}
                                </p>
                            )}
                        </div>

                        <div className="w-full flex flex-col items-start justify-center gap-2">
                            <div className="w-full flex items-center gap-2">
                                <label
                                    htmlFor="saleEndTime"
                                    className="text-sm text-text-muted font-medium"
                                >
                                    Sale End Time:
                                </label>
                                <input
                                    id="saleEndTime"
                                    type="datetime-local"
                                    {...register("saleEndTime", {
                                        required: "Sale End Time is required",
                                        validate: (value) => {
                                            return (
                                                !watchStartTime ||
                                                new Date(value) >
                                                    new Date(watchStartTime) ||
                                                "End time must be after the start time"
                                            );
                                        },
                                    })}
                                    className="p-1.5 border border-border rounded-lg hover:cursor-pointer outline-0 hover:border-border-hover focus:border-border-hover"
                                />
                            </div>
                            {errors && (
                                <p className="text-sm text-error font-medium">
                                    {errors.saleEndTime?.message}
                                </p>
                            )}
                        </div>

                        {/* buttons */}
                        <div className="w-full flex xs:flex-row flex-col items-center justify-end gap-2">
                            <button
                                type="button"
                                className="w-full border border-border px-4 py-2 rounded-lg bg-surface text-sm text-text-primary font-medium hover:cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-scale duration-200 ease-in-out"
                            >
                                Add New Product
                            </button>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 rounded-lg bg-btn-primary text-sm text-btn-text font-medium hover:cursor-pointer hover:bg-btn-hover shadow-md hover:shadow-lg active:scale-[0.98] transition-scale duration-200 ease-in-out"
                            >
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
