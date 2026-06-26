import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();

    return (
        <nav className="fixed bg-primary-bg h-14 z-10 w-full flex item-center justify-center border-b border-border shadow-sm">
            <div className="w-full max-w-6xl flex items-center justify-between">
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
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <button className="text-text-main hover:text-text-muted text-sm font-semibold cursor-pointer hover:underline hover:cursor-pointer">
                                Logout
                            </button>
                            <p className="w-9 h-9 flex items-center justify-center bg-btn-primary rounded-full text-btn-text font-semibold cursor-pointer hover:bg-btn-hover hover:scale-[1.05] transition-all duration-150">
                                {user?.username[0].toUpperCase() || "U"}
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                navigate("/login");
                            }}
                            className="px-5 py-2 bg-btn-primary hover:bg-btn-hover rounded-full text-btn-text font-medium cursor-pointer"
                        >
                            Login/Register
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
