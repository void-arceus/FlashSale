import {
    useContext,
    createContext,
    useState,
    useRef,
    type ReactNode,
} from "react";

interface ToastContextType {
    text: string;
    isActive: boolean;
    status: string;
    showToaster: (message: string, status: "success" | "error") => void;
}

interface ToastProviderType {
    children: ReactNode;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderType) {
    const [text, setText] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");

    const timeRef = useRef<number | null>(null);

    // functions
    const showToaster = (message: string, status: string) => {
        setText(message);
        setIsActive(true);
        setStatus(status);

        if (timeRef.current !== null) {
            clearTimeout(timeRef.current);
        }
        timeRef.current = setTimeout(() => {
            setIsActive(false);
            setText("");
            setStatus("");
        }, 2000);
    };

    return (
        <ToastContext.Provider value={{ text, isActive, status, showToaster }}>
            {children}
        </ToastContext.Provider>
    );
}

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within Toast Provider");
    }
    return context;
};
