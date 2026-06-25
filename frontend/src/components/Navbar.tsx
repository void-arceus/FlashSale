import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="fixed bg-primary-bg z-10 w-full flex item-center justify-center border-b border-border shadow-sm">
            <div className="w-full max-w-6xl py-3 px-2 flex items-center justify-between">
                {/* logo */}
                <div className="flex items-center">
                    <h1
                        onClick={() => {
                            navigate("/");
                        }}
                        className="text-xl font-semibold hover:cursor-pointer"
                    >
                        FlashSale
                    </h1>
                </div>

                {/* nav menu */}
                <ul className="flex items-center list-none gap-4">
                    <li className="text-md font-medium text-text-main hover:cursor-pointer hover:text-text-muted">
                        <a>All Products</a>
                    </li>
                    <li className="text-md font-medium text-text-main hover:cursor-pointer hover:text-text-muted">
                        <a>Flash Sales</a>
                    </li>
                </ul>

                {/* buttons */}
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            navigate("/login");
                        }}
                        className="px-5 py-2 bg-btn-primary hover:bg-btn-hover rounded-full text-btn-text font-medium cursor-pointer"
                    >
                        Login/Register
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
