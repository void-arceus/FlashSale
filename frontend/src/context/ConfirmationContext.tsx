import { createContext, useContext, useState, type ReactNode } from "react";

interface ConfirmationContextType {
    isActive: boolean;
    text: string;
    showConfirmation: (message: string, onConfirmAction: () => void) => void;
    closeModal: () => void;
    triggerConfirm: () => void;
    loading: boolean;
}

interface ConfirmationProviderProps {
    children: ReactNode;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
    undefined,
);

export function ConfirmationProvider({ children }: ConfirmationProviderProps) {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const showConfirmation = (message: string, onConfirmAction: () => void) => {
        setText(message);
        setOnConfirm(() => onConfirmAction);
        setIsActive(true);
    };

    const closeModal = () => {
        setIsActive(false);
        setText("");
        setOnConfirm(null);
    };

    const triggerConfirm = () => {
        try {
            setLoading(true);
            if (onConfirm) {
                onConfirm();
            }
        } catch (error: any) {
            setLoading(false);
        } finally {
            closeModal();
            setLoading(false);
        }
    };

    return (
        <ConfirmationContext.Provider
            value={{
                isActive,
                text,
                showConfirmation,
                closeModal,
                triggerConfirm,
                loading,
            }}
        >
            {children}
        </ConfirmationContext.Provider>
    );
}

export const useConfirmation = (): ConfirmationContextType => {
    const context = useContext(ConfirmationContext);
    if (context === undefined) {
        throw new Error(
            "useConfirmation must be used within Confirmation Provider",
        );
    }
    return context;
};
