import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { addProduct } from "../../products/services/productService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import Loading from "../../../components/ui/Loading";

export interface ProductInputType {
    productName: string;
    image: FileList | File;
    description: string;
    quantity: number;
    originalPrice: number;
    salePrice: number;
    category: string;
    saleStartTime: Date;
    saleEndTime: Date;
}

function AddProduct() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductInputType>({ defaultValues: { category: "" } });
    const navigate = useNavigate();
    const { showToaster } = useToast();
    const [loading, setLoading] = useState(false);

    const onFormSubmit: SubmitHandler<ProductInputType> = async (data) => {
        const formData = new FormData();

        // add image to the formData object
        const imageFile = (data.image as any)?.[0];
        if (imageFile) {
            formData.append("image", imageFile as File);
        }

        Object.keys(data).forEach((key) => {
            if (key !== "image") {
                formData.append(
                    key,
                    String(data[key as keyof ProductInputType]),
                );
            }
        });
        try {
            setLoading(true);
            const res = await addProduct(formData);
            if (res.status === true) {
                showToaster(res.message, "success");
                reset();
            } else {
                showToaster(res.message, "error");
            }
        } catch (error: any) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
        navigate("/");
    };

    return (
        <section className="w-full flex flex-col items-center justify-start h-screen pt-14">
            <div className="w-full max-w-6xl flex items-center justify-center px-4 pt-5">
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="h-fit w-full max-w-2xl bg-surface p-3 rounded-xl shadow-sm flex flex-col items-center gap-6 mb-5"
                >
                    <h1 className="text-2xl font-semibold text-text-main">
                        Add Product
                    </h1>
                    <div className="w-full flex flex-col items-start gap-1">
                        <label className="text-sm font-medium text-text-main">
                            Product Name* :
                        </label>
                        <input
                            id="productName"
                            type="text"
                            placeholder="product name"
                            {...register("productName", {
                                required: "Product Name is required",
                            })}
                            className="border-2 border-border p-2 rounded-lg bg-white w-full outline-0 hover:border-btn-primary focus:border-btn-primary text-text-body transition-all duration-200 ease-in"
                        />
                        {errors.productName && (
                            <p className="text-sm text-error font-medium">
                                {errors.productName.message}
                            </p>
                        )}
                    </div>

                    <div className="w-full flex flex-col items-start gap-1">
                        <label className="text-sm font-medium text-text-main">
                            Description* :
                        </label>
                        <textarea
                            id="description"
                            placeholder="Description"
                            {...register("description", {
                                required: "Product description is required",
                            })}
                            className="border-2 border-border resize-none h-30 p-2 rounded-lg bg-white w-full outline-0 hover:border-btn-primary focus:border-btn-primary text-text-body transition-all duration-200 ease-in"
                        />
                        {errors.description && (
                            <p className="text-sm text-error font-medium">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* quantity and category  */}
                    <div className="w-full flex flex-col gap-6 sm:gap-0 sm:flex-row items-center justify-between sm:items-start">
                        <div className="w-full sm:w-1/2 flex flex-col items-start justify-start gap-2">
                            <div className="w-ful flex flex-col items-start gap-1">
                                <label
                                    htmlFor="quantity"
                                    className="text-sm font-medium text-text-main"
                                >
                                    Quantity* :
                                </label>
                                <input
                                    id="quantity"
                                    type="number"
                                    placeholder="quantity"
                                    {...register("quantity", {
                                        required: "Quantity is required",
                                    })}
                                    className="border-2 border-border hover:border-border-focus focus:border-border-focus outline-0 p-2 rounded-lg transition-all duration-200 ease-in"
                                />
                            </div>
                            {errors.quantity && (
                                <p className="text-sm text-error font-medium">
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>
                        <div className="w-full sm:w-1/2 flex flex-col items-start justify-start gap-2">
                            <label
                                htmlFor="category"
                                className="text-sm text-text-main font-medium"
                            >
                                Category* :
                            </label>
                            <select
                                id="category"
                                {...register("category", {
                                    required: "Category is required",
                                })}
                                className="border-2 border-border hover:border-border-focus p-2 rounded-lg text-sm font-medium cursor-pointer"
                            >
                                <option value="mobile">Mobile</option>
                                <option value="tablet">Tablet</option>
                                <option value="laptop">Laptop</option>
                                <option value="accessories">Accessories</option>
                            </select>
                            {errors.category && (
                                <p className="text-sm text-error font-medium">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* quantity and category  */}
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-0 sm:items-center sm:justify-between">
                        <div className="w-full flex flex-col items-start justify-start gap-2">
                            <div className="w-ful flex flex-col items-start gap-1">
                                <label
                                    htmlFor="originalPrice"
                                    className="text-sm font-medium text-text-main"
                                >
                                    Original Price* :
                                </label>
                                <input
                                    id="originalPrice"
                                    type="number"
                                    placeholder="original price"
                                    {...register("originalPrice", {
                                        required: "Original Price is required",
                                    })}
                                    className="border-2 border-border hover:border-border-focus focus:border-border-focus outline-0 p-2 rounded-lg transition-all duration-200 ease-in"
                                />
                            </div>
                            {errors.originalPrice && (
                                <p className="text-sm text-error font-medium">
                                    {errors.originalPrice.message}
                                </p>
                            )}
                        </div>
                        <div className="w-full flex flex-col items-start justify-start gap-2">
                            <div className="w-full flex flex-col items-start gap-1">
                                <label
                                    htmlFor="salePrice"
                                    className="text-sm font-medium text-text-main"
                                >
                                    Sale Price* :
                                </label>
                                <input
                                    id="salePrice"
                                    type="number"
                                    placeholder="salePrice"
                                    {...register("salePrice", {
                                        required: "Sale Price is required",
                                    })}
                                    className="border-2 border-border hover:border-border-focus focus:border-border-focus outline-0 p-2 rounded-lg transition-all duration-200 ease-in"
                                />
                            </div>
                            {errors.salePrice && (
                                <p className="text-sm text-error font-medium">
                                    {errors.salePrice.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* sale start time and end time  */}
                    <div className="w-full flex flex-col items-start justify-center gap-6">
                        <div className="w-full flex flex-col items-start gap-2">
                            <div className="flex items-center flex-wrap gap-2">
                                <label className="text-sm font-medium text-text-main">
                                    Sale Start Time* :
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register("saleStartTime", {
                                        required:
                                            "Sales start time is required",
                                    })}
                                    className="cursor-pointer p-1 border-2 border-border outline-0 focus:border-border-focus hover:border-border-focus rounded-lg"
                                />
                            </div>
                            {errors.saleStartTime && (
                                <p className="text-sm font-medium text-error">
                                    {errors.saleStartTime.message}
                                </p>
                            )}
                        </div>
                        <div className="w-full flex flex-col items-start gap-2">
                            <div className="w-full flex flex-wrap items-center justify-start gap-1">
                                <label className="text-sm font-medium text-text-main">
                                    Sale End Time* :
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register("saleEndTime", {
                                        required: "Sale End time is required",
                                    })}
                                    className="cursor-pointer p-1 border-2 border-border outline-0 focus:border-border-focus hover:border-border-focus rounded-lg"
                                />
                            </div>
                            {errors.saleEndTime && (
                                <p className="text-sm font-medium text-error">
                                    {errors.saleEndTime.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* image input */}
                    <div className="w-full flex flex-col items-start justify-center gap-2">
                        <div className="w-full flex flex-wrap items-center justify-start gap-2">
                            <label
                                htmlFor="image"
                                className="text-sm font-medium text-text-main"
                            >
                                Upload Image* :
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                {...register("image", {
                                    required: "Product image is required",
                                })}
                                className="block cursor-pointer text-sm text-text-body file:px-4 file:mr-4 file:py-1 file:border file:border-border-focus file:rounded-lg file:text-sm file:font-semibold hover:file:bg-surface"
                            />
                        </div>
                        {errors.image && (
                            <p className="text-sm text-error font-medium">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* form buttons */}
                    <div className="w-full flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => handleCancel()}
                            className="text-text-main"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-btn-primary hover:bg-btn-hover hover:cursor-pointer text-btn-text font-medium px-4 py-1.5 rounded-xl active:scale-[0.99] transition-all duration-100 ease-in flex items-center justify-center"
                        >
                            {loading ? <Loading /> : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default AddProduct;
