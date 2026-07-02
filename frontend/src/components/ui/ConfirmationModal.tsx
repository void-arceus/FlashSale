import { useConfirmation } from "../../context/ConfirmationContext";

export default function ConfirmationModal() {
    const { text, isActive, closeModal, triggerConfirm } = useConfirmation();
    return (
        <div
            className={`${isActive ? "fixed inset-0" : "hidden"} h-screen z-50 w-screen bg-black/50 flex items-center justify-center`}
        >
            <div className="bg-surface w-full max-w-sm px-10 py-8 flex flex-col items-center justify-center gap-3 rounded-xl shadow-lg">
                <p className="text-center">{text}</p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => closeModal()}
                        className="px-4 py-1 bg-gray-200 border border-border rounded-md hover:cursor-pointer hover:shadow-sm"
                    >
                        No
                    </button>
                    <button
                        onClick={() => triggerConfirm()}
                        className="px-4 py-1 bg-btn-primary text-btn-text hover:bg-btn-hover hover:cursor-pointer rounded-md hover:shadow-sm"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
}
