import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import type { Product } from "../features/products/services/productService";
import GeneralProductCard from "./GeneralProductCard";

function Homepage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        handleGetProducts();
    }, []);

    const handleGetProducts = async () => {
        const result = await getProducts();
        if (result.status && result.data) {
            setProducts(result.data);
        }
    };

    return (
        <main className="pt-16 w-full flex items-center justify-center">
            <section className="relative w-full max-w-6xl flex flex-col">
                {/* testing displaying product data*/}
                <h1 className="px-4 text-2xl font-semibold text-text-main mb-3">
                    All Products
                </h1>
                <div className="w-full px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <GeneralProductCard product={p} key={p._id} />
                        ))
                    ) : (
                        <div>No Products Found</div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Homepage;
