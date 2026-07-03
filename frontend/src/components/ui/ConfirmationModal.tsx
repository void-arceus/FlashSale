import { useConfirmation } from "../../context/ConfirmationContext";
import type { MouseEvent } from "react";
import Loading from "./Loading";

export default function ConfirmationModal() {
    const { text, isActive, closeModal, triggerConfirm, loading } =
        useConfirmation();

    return (
        <div
            onClick={() => closeModal()}
            className={`${isActive ? "fixed inset-0" : "hidden"} h-screen z-50 w-screen bg-black/50 flex items-center justify-center`}
        >
            <div
                onClick={(e: MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                }}
                className="bg-surface w-full max-w-sm px-10 py-8 flex flex-col items-center justify-center gap-3 rounded-xl shadow-lg"
            >
                <p className="text-center">{text}</p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => closeModal()}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-100 border border-border rounded-md hover:cursor-pointer hover:shadow-sm"
                    >
                        No
                    </button>
                    <button
                        onClick={(): void => {
                            triggerConfirm();
                        }}
                        disabled={loading}
                        className="px-6 py-2 bg-btn-primary text-btn-text hover:bg-btn-hover hover:cursor-pointer rounded-md hover:shadow-sm flex items-center justify-center"
                    >
                        {loading ? <Loading /> : "Yes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
