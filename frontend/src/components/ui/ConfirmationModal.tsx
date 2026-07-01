import { useConfirmation } from "../../context/ConfirmationContext";

export default function ConfirmationModal() {
    const { text, isActive, closeModal, triggerConfirm } = useConfirmation();
    return (
        <div
            className={`${isActive ? "fixed inset-0" : "hidden"} h-screen z-50 w-screen bg-black/50 flex items-center justify-center`}
        >
            <div className="bg-surface w-full max-w-sm px-10 py-6 flex flex-col items-center justify-center gap-5 rounded-xl shadow-lg">
                <p className="text-center">{text}</p>
                <div className="flex items-center justify-center gap-6">
                    <button onClick={() => closeModal()}>No</button>
                    <button onClick={() => triggerConfirm()}>Yes</button>
                </div>
            </div>
        </div>
    );
}
