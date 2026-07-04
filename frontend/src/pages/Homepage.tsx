import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import type { Product } from "../features/products/services/productService";
import GeneralProductCard from "./GeneralProductCard";
import Loading from "../components/ui/Loading";

function Homepage() {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        handleGetProducts();
    }, []);

    const handleGetProducts = async () => {
        try {
            setLoading(true);
            const result = await getProducts();
            if (result.status && result.data) {
                setProducts(result.data);
            }
        } catch (error: any) {
            1;
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pt-16 w-full flex items-center justify-center">
            {loading ? (
                <div className="h-screen w-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <section className="relative w-full max-w-6xl flex flex-col">
                    {/* testing displaying product data*/}
                    <h1 className="px-4 text-2xl font-semibold text-text-main mb-3">
                        All Products
                    </h1>
                    {products ? (
                        <div className="w-full px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map((p) => (
                                <GeneralProductCard product={p} key={p._id} />
                            ))}
                        </div>
                    ) : loading ? null : (
                        <div className="h-screen w-full flex items-center justify-center text-3xl font-semibold text-error">
                            No Products Found
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}

export default Homepage;
