import { useEffect, useState } from "react";
import { getAdminProducts } from "../../products/services/productService";
import type { Product } from "../../products/services/productService";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { ScheduleSale } from "../../products/services/flashsaleService";
import Loading from "../../../components/ui/Loading";
import { useNavigate } from "react-router-dom";
import closeBtn from "../../../assets/close_btn.svg";

interface FlashSaleInput {
    productId: string;
    adminId: string;
    originalPrice: number;
    saleQuantity: number;
    salePrice: number;
    saleStartTime: string;
    saleEndTime: string;
}

interface SaleFormProps {
    appendNewSaleData: (obj: any) => void;
}

function ScheduleSaleForm({ appendNewSaleData }: SaleFormProps) {
    // get the product names and original price
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const { showToaster } = useToast();
    const navigate = useNavigate();

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
        data.originalPrice = Number(selectedProduct?.originalPrice);
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, String(data[key as keyof FlashSaleInput]));
        });

        const obj = Object.fromEntries(formData.entries());
        obj.adminId = String(user?.id);
        const newData = {
            data: obj,
        };

        try {
            setLoading(true);
            const res = await ScheduleSale(newData);
            if (res.status === true) {
                showToaster(res.message, "success");
            } else {
                showToaster(res.message, "error");
            }
        } catch (error: any) {
            setLoading(false);
        } finally {
            setLoading(false);
            reset();
        }
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
        <main className="absolute h-screen w-full bg-black/60 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative w-full max-w-xl bg-primary-bg border border-border p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4"
            >
                {/* form close button */}
                <button
                    type="button"
                    onClick={appendNewSaleData}
                    className="absolute right-3 top-3 hover:cursor-pointer hover:scale-102 transition-scale duration-100 ease-in"
                >
                    <img
                        src={closeBtn}
                        alt="close-icon"
                        className="h-7 border-border"
                    />
                </button>
                <h1 className="text-lg font-medium text-text-main">
                    Schedule Sale
                </h1>
                <div className=" w-full flex sm:flex-row flex-col sm:items-center items-start gap-2">
                    <div className="w-full flex-2 flex flex-col items-start gap-2">
                        <div className="w-full flex xs:flex-row flex-col  xs:items-center items-start gap-2">
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
                                <option value="">--Choose an item--</option>
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
                            <p className="text-sm font-medium text-success">
                                ₹{selectedProduct.originalPrice}
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className="w-full flex sm:flex-row flex-col sm:items-center items-start">
                    {/* sale price */}
                    <div className="w-full flex flex-col items-start justify-center gap-2">
                        <div className="w-full flex items-center">
                            <label
                                htmlFor="salePrice"
                                className="text-sm text-text-muted font-medium"
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
                                        message: "Price must be greater than 0",
                                    },
                                    validate: (value) =>
                                        !selectedProduct ||
                                        Number(value) <
                                            selectedProduct?.originalPrice ||
                                        "Price must be less then original price",
                                })}
                                className="border border-border rounded-lg max-w-30 p-2 text-sm text-text-main font-medium outline-0 hover:border-border-hover focus:border-border-hover"
                            />
                        </div>
                        {errors && (
                            <p className="text-sm text-error font-medium">
                                {errors.salePrice?.message}
                            </p>
                        )}
                    </div>

                    {/* sale quantity */}
                    <div className="w-full flex flex-col items-start justify-center gap-2">
                        <div className="w-full flex items-center gap-2">
                            <label
                                htmlFor="saleQuantity"
                                className="text-sm text-text-muted font-medium"
                            >
                                Quantity:
                            </label>
                            <input
                                id="saleQuantity"
                                type="number"
                                {...register("saleQuantity", {
                                    required: "Sale quantity is required",
                                })}
                                className="border border-border text-sm text-text-main font-medium p-2 max-w-30 rounded-lg outline-0 focus:border-border-hover hover:border-border-hover"
                            />
                        </div>
                        {errors && (
                            <p className="text-sm text-error font-medium ">
                                {errors.saleQuantity?.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* sale timing */}
                <div className="w-full flex flex-col items-start justify-center gap-2">
                    <div className="w-full flex xs:flex-row flex-col  xs:items-center items-start gap-2">
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
                                required: "Sale Start time is required!",
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
                    <div className="w-full flex xs:flex-row flex-col  xs:items-center items-start gap-2">
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
                        onClick={() => {
                            navigate("/addProduct");
                        }}
                        className="w-full border border-border px-4 py-2 rounded-lg bg-surface text-sm text-text-primary font-medium hover:cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-scale duration-200 ease-in-out"
                    >
                        Add New Product
                    </button>
                    <button
                        type="submit"
                        className="w-full border border-btn-primary px-4 py-2 rounded-lg bg-btn-primary text-sm text-btn-text font-medium hover:cursor-pointer hover:bg-btn-hover shadow-md hover:shadow-lg active:scale-[0.98] transition-scale duration-200 ease-in-out flex items-center justify-center"
                    >
                        {loading ? <Loading size={5} /> : "Schedule Sale"}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default ScheduleSaleForm;
