import { useToast } from "../../context/ToastContext";

export default function Toaster() {
    const { isActive, text, status } = useToast();
    const success =
        "border boder-success bg-success-bg text-success font-semibold";
    const error = "border border-error bg-error-bg text-error font-semibold";
    return (
        <div
            className={`absolute z-50 right-6 top-20 transform transition-all duration-250 ease-out ${isActive ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"} ${status === "success" ? success : status === "error" ? error : ""} max-w-xs px-6 p-3 shadow-md rounded-lg text-sm`}
        >
            {text}
        </div>
    );
}
