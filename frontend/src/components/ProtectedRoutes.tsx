import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./ui/Loading";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

function ProtectedRoutes({ allowedRoles }: ProtectedRouteProps) {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (user && !allowedRoles.includes(String(user.role))) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoutes;
