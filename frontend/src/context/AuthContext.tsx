import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../features/auth/services/authService";
import type { ReactNode } from "react";

// creating userdata interface
export interface userDataType {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: userDataType | null;
    isLoggedIn: boolean;
    setUserData: Function;
    loading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<userDataType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        try {
            const res = await getCurrentUser();
            if (res.status === true) {
                setUser(res.data as userDataType);
            } else {
                setUser(null);
            }
        } catch (error: any) {
            setUser(null);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    const setUserData = (data: userDataType) => {
        setUser(data);
    };
    return (
        <AuthContext.Provider
            value={{ user, isLoggedIn: !!user, setUserData, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within and AuthProvider");
    }
    return context;
};
