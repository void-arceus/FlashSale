import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { addProduct } from "../../products/services/productService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { useLocation } from "react-router-dom";
import { updateProduct } from "../../products/services/productService";
import Loading from "../../../components/ui/Loading";

export interface ProductInputType {
    _id?: string;
    productName: string;
    productImageUrl?: string;
    image: FileList | File;
    productDescription: string;
    productQuantity: number;
    productOriginalPrice: number;
    productCategory: string;
}

export interface UpdatePayload {
    data: Partial<ProductInputType>;
}

interface StateShape {
    editing: boolean;
    product: ProductInputType;
}

function AddProduct() {
    const location = useLocation();
    const state = location.state as StateShape | null;
    const [editing, setEditing] = useState<boolean>(!!state?.editing);

    const existingProduct = state?.product;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = useForm<ProductInputType>({
        defaultValues: {
            productName: existingProduct?.productName || "",
            productDescription: existingProduct?.productDescription || "",
            productQuantity: Number(existingProduct?.productQuantity) || 0,
            productCategory: existingProduct?.productCategory || "",
            productOriginalPrice:
                Number(existingProduct?.productOriginalPrice) || 0,
        },
    });
    const navigate = useNavigate();
    const { showToaster } = useToast();
    const [loading, setLoading] = useState(false);

    const onFormSubmit: SubmitHandler<ProductInputType> = async (data) => {
        if (editing) {
            const changedFields = (
                Object.keys(dirtyFields) as Array<keyof ProductInputType>
            ).reduce<Partial<ProductInputType>>((acc, key) => {
                acc[key] = data[key] as any;
                return acc;
            }, {});

            for (const [key, value] of Object.entries(changedFields)) {
                if (
                    value === undefined ||
                    value === null ||
                    String(value).trim() === ""
                ) {
                    showToaster(`${String(key)} cannot be empty!`, "error");
                    return;
                }
            }

            // call the update api
            const newData: UpdatePayload = {
                data: changedFields,
            };

            try {
                setLoading(true);
                // call api
                const res = await updateProduct(
                    existingProduct?._id as string,
                    newData,
                );
                if (res.status === true) {
                    showToaster(res.message, "success");
                    reset();
                    navigate("/productManager");
                } else {
                    showToaster(res.message, "error");
                }
            } catch (error: any) {
                setLoading(false);
            } finally {
                setLoading(false);
            }
            return;
        }

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
        console.log("Form data:", formData);
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
            setEditing(false);
        }
    };

    const handleCancel = () => {
        reset();
        navigate("/productManager");
        setEditing(false);
    };

    return (
        <main className="w-full flex flex-col items-center justify-start h-screen pt-14">
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
                            id="productDescription"
                            placeholder="productDescription"
                            {...register("productDescription", {
                                required:
                                    "Product productDescription is required",
                            })}
                            className="border-2 border-border resize-none h-30 p-2 rounded-lg bg-white w-full outline-0 hover:border-btn-primary focus:border-btn-primary text-text-body transition-all duration-200 ease-in"
                        />
                        {errors.productDescription && (
                            <p className="text-sm text-error font-medium">
                                {errors.productDescription.message}
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
                                    {...register("productQuantity", {
                                        required: "Quantity is required",
                                    })}
                                    className="border-2 border-border hover:border-border-focus focus:border-border-focus outline-0 p-2 rounded-lg transition-all duration-200 ease-in"
                                />
                            </div>
                            {errors.productQuantity && (
                                <p className="text-sm text-error font-medium">
                                    {errors.productQuantity.message}
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
                                {...register("productCategory", {
                                    required: "Category is required",
                                })}
                                className="border-2 border-border hover:border-border-focus p-2 rounded-lg text-sm font-medium cursor-pointer"
                            >
                                <option value="mobile">Mobile</option>
                                <option value="tablet">Tablet</option>
                                <option value="laptop">Laptop</option>
                                <option value="accessories">Accessories</option>
                            </select>
                            {errors.productCategory && (
                                <p className="text-sm text-error font-medium">
                                    {errors.productCategory.message}
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
                                    {...register("productOriginalPrice", {
                                        required: "Original Price is required",
                                    })}
                                    className="border-2 border-border hover:border-border-focus focus:border-border-focus outline-0 p-2 rounded-lg transition-all duration-200 ease-in"
                                />
                            </div>
                            {errors.productOriginalPrice && (
                                <p className="text-sm text-error font-medium">
                                    {errors.productOriginalPrice.message}
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
                                {editing
                                    ? "Update Product Image (optional)"
                                    : "Upload Image* :"}
                            </label>

                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                {...register("image", {
                                    required: !editing
                                        ? "Product image is required"
                                        : "",
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
                            className="text-text-main text-sm font-medium cursor-pointer hover:underline hover:text-text-muted"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-btn-primary hover:bg-btn-hover hover:cursor-pointer text-btn-text text-sm font-medium px-4 py-1.5 rounded-lg active:scale-[0.99] transition-all duration-100 ease-in flex items-center justify-center"
                        >
                            {loading ? (
                                <Loading size={5} />
                            ) : editing ? (
                                "Update"
                            ) : (
                                "Add"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default AddProduct;
