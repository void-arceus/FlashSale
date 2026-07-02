import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../products/services/productService";
import { getAdminProducts } from "../../products/services/productService";
import { useAuth } from "../../../context/AuthContext";
import ProductCard from "./ProductCard";
import Loading from "../../../components/ui/Loading";

function ProductManager() {
    const [products, setProducts] = useState<Product[] | undefined>([]);
    const [productLoading, setProductLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            AdminProducts(user.id);
        }
    }, [loading, user]);

    // get admin products
    const AdminProducts = async (id: string) => {
        try {
            setProductLoading(true);
            const res = await getAdminProducts(id);
            setProducts(res.data);
        } catch (error: any) {
            setProductLoading(false);
        } finally {
            setProductLoading(false);
        }
    };

    return (
        <section className="pt-16 h-screen w-full flex items-center justify-center">
            <main className="h-full w-full max-w-6xl flex flex-col items-start">
                <div className="w-full px-4 pt-2 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-text-main">
                        Your Products
                    </h1>
                    <button
                        onClick={() => {
                            navigate("/addProduct");
                        }}
                        className="px-3 py-1.5 bg-btn-primary rounded-xl text-btn-text font-medium hover:cursor-pointer hover:bg-btn-hover active:scale-[0.96]"
                    >
                        Add Product +
                    </button>
                </div>

                {/* display all admin products */}
                {productLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <Loading />
                    </div>
                ) : (
                    <>
                        {products ? (
                            <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4">
                                {products.map((product) => (
                                    <ProductCard
                                        product={product}
                                        key={product._id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div>No Products Found!</div>
                        )}
                    </>
                )}
            </main>
        </section>
    );
}

export default ProductManager;
