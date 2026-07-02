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
import Toaster from "./components/ui/Toaster";
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
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/register"
                                    element={<RegisterPage />}
                                />

                                {/* admin routes */}
                                <Route
                                    path="/admin"
                                    element={<AdminDashboard />}
                                />
                                <Route
                                    path="/productManager"
                                    element={<ProductManager />}
                                />
                                <Route
                                    path="addProduct"
                                    element={<AddProduct />}
                                />
                            </Routes>
                        </Router>
                    </ConfirmationProvider>
                </ToastProvider>
            </AuthProvider>
        </>
    );
}

export default App;
