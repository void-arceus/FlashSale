import { useAuth } from "../../../context/AuthContext";

function AdminDashboard() {
    const { isLoggedIn } = useAuth();
    return (
        <div className="pt-20">
            <h1>Admin Dashboard</h1>
            <p>{isLoggedIn ? "User is logged in" : "No user found"}</p>
        </div>
    );
}

export default AdminDashboard;
