import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../products/services/productService";
import { getAdminProducts } from "../../products/services/productService";
import { useAuth } from "../../../context/AuthContext";
import ProductCard from "./ProductCard";

function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            AdminProducts(user.id);
        }
    }, [loading, user]);

    // get admin products
    const AdminProducts = async (id: string) => {
        const res = await getAdminProducts(id);
        setProducts(res.data);
    };

    return (
        <section className="pt-16 w-full flex items-center justify-center">
            <main className="w-full max-w-6xl flex flex-col items-start">
                <h1>Product Manager</h1>
                <button
                    onClick={() => {
                        navigate("/addProduct");
                    }}
                    className="px-3.5 py-1.5 bg-btn-primary rounded-xl text-btn-text font-medium hover:cursor-pointer hover:bg-btn-hover active:scale-[0.96]"
                >
                    Add Product
                </button>

                {/* display all admin products */}
                <div>
                    {products ? (
                        <div className="w-full grid grid-cols-3 gap-4">
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
                </div>
            </main>
        </section>
    );
}

export default ProductManager;
