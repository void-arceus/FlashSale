import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import type { Product } from "../features/products/services/productService";

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
        <section className="pt-16 w-full flex items-center justify-center">
            <main className="relative w-full max-w-6xl flex flex-col">
                {/* testing displaying product data*/}
                <h1 className="px-4 text-2xl font-semibold text-text-main mb-3">
                    All Products
                </h1>
                <div className="w-full px-4 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <div
                                key={p._id}
                                className="w-full border border-border rounded-lg p-2 flex flex-col gap-2"
                            >
                                <div className="w-full h-64 overflow-hidden rounded-lg bg-slate-100">
                                    <img
                                        src={p.url}
                                        alt={p.productName}
                                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-md font-semibold text-text-main">
                                        {p.productName}
                                    </h2>
                                    <p className="text-sm text-text-muted font-medium">
                                        {p.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No Products Found</div>
                    )}
                </div>
            </main>
        </section>
    );
}

export default Homepage;
