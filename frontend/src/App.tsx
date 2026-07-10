import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmationProvider } from "./context/ConfirmationContext";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import Navbar from "./components/Navbar";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import Homepage from "./pages/Homepage";
import axios from "axios";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import ProductManager from "./features/admin/pages/ProductManager";
import AddProduct from "./features/admin/pages/AddProduct";
import SaleCoordinator from "./features/admin/pages/SaleCoordinator";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Unauthorized } from "./components/Unauthorized";
import Toaster from "./components/ui/Toaster";
import Sales from "./features/user/pages/Sales";
import ProductDetail from "./features/user/pages/ProductDetail";
axios.defaults.withCredentials = true;

function App() {
    return (
        <>
            <AuthProvider>
                <ToastProvider>
                    <ConfirmationProvider>
                        <Router>
                            <Navbar />
                            <Toaster />
                            <ConfirmationModal />
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route
                                    path="/unauthorized"
                                    element={<Unauthorized />}
                                />
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/register"
                                    element={<RegisterPage />}
                                />

                                {/* user routes */}
                                <Route path="/sales" element={<Sales />} />
                                <Route
                                    path="/productDetail"
                                    element={<ProductDetail />}
                                />

                                {/* admin routes */}
                                <Route
                                    element={
                                        <ProtectedRoutes
                                            allowedRoles={["admin"]}
                                        />
                                    }
                                >
                                    <Route
                                        path="/adminDashboard"
                                        element={<AdminDashboard />}
                                    />
                                    <Route
                                        path="/productManager"
                                        element={<ProductManager />}
                                    />
                                    <Route
                                        path="/addProduct"
                                        element={<AddProduct />}
                                    />
                                    <Route
                                        path="coordinator"
                                        element={<SaleCoordinator />}
                                    />
                                </Route>
                            </Routes>
                        </Router>
                    </ConfirmationProvider>
                </ToastProvider>
            </AuthProvider>
        </>
    );
}

export default App;
