import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../features/auth/services/authService";
import type { ReactNode } from "react";

// creating userdata interface
export interface userDataType {
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: userDataType | null;
    isLoggedIn: boolean;
    setUserData: Function;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<userDataType | null>(null);

    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        const res = await getCurrentUser();
        if (res.status === true) {
            setUser(res.data as userDataType);
        } else {
            setUser(null);
        }
    };

    const setUserData = (data: userDataType) => {
        setUser(data);
    };
    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be userd within and AuthProvider");
    }
    return context;
};
