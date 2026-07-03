import { useNavigate } from "react-router-dom";

export function Unauthorized() {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 p-4">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-error text-center">
                    Unauthorized! Action not allowed
                </h1>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-btn-primary hover:bg-btn-hover hover:cursor-pointer text-btn-text font-medium rounded-lg shadow-md hover:shadow-lg"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
}
