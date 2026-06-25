import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
