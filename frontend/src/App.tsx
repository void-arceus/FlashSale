import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import axios from "axios";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
axios.defaults.withCredentials = true;

function App() {
    return (
        <>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </>
    );
}

export default App;
