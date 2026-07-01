import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../features/auth/services/authService";
import { useConfirmation } from "../context/ConfirmationContext";

function Navbar() {
    const navigate = useNavigate();
    const { isLoggedIn, user, setUserData } = useAuth();

    const handleLogout = async () => {
        const res = await logout();
        if (res.status === true) {
            console.log(res.message);
            setUserData(null);
            navigate("/");
        } else {
            console.error(res.message);
            return;
        }
    };

    return (
        <nav className="fixed bg-primary-bg h-14 z-10 w-full flex item-center justify-center border-b border-border shadow-sm px-4">
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
                {isLoggedIn ? (
                    <>
                        {user && user.role === "admin" ? (
                            <ul className="flex items-center gap-4">
                                <li className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline">
                                    Dashboard
                                </li>
                                <li
                                    onClick={() => {
                                        navigate("/productManager");
                                    }}
                                    className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline"
                                >
                                    Product Manager
                                </li>
                                <li className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline">
                                    Flash Sale Coordinator
                                </li>
                                <li className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline">
                                    Order Ledger
                                </li>
                            </ul>
                        ) : user && user.role === "user" ? (
                            <ul className="flex items-center gap-4">
                                <li className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline">
                                    Store
                                </li>
                                <li className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline">
                                    Flash Sales
                                </li>
                                <li className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline">
                                    My Orders
                                </li>
                                <li className="text-sm font-semibold text-text-main hover:text-text-muted hover:cursor-pointer hover:underline">
                                    Profile
                                </li>
                            </ul>
                        ) : null}
                    </>
                ) : (
                    <ul className="flex items-center gap-5">
                        <li className="text-sm font-semibold hover:underline hover:cursor-pointer text-text-main hover:text-text-muted">
                            Store
                        </li>
                        <li className="text-sm font-semibold hover:underline hover:cursor-pointer text-text-main hover:text-text-muted">
                            Flash Sale
                        </li>
                    </ul>
                )}
                <ul className="flex items-center list-none gap-4"></ul>

                {/* buttons */}
                <div className="flex items-center">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    handleLogout();
                                }}
                                className="text-text-main hover:text-text-muted text-sm font-semibold cursor-pointer hover:underline hover:cursor-pointer"
                            >
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
