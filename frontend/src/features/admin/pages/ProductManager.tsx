import { useNavigate } from "react-router-dom";

function ProductManager() {
    const navigate = useNavigate();

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
            </main>
        </section>
    );
}

export default ProductManager;
