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
                className="bg-surface w-full max-w-sm px-10 py-8 flex flex-col items-center justify-center gap-3 rounded-xs shadow-lg"
            >
                <p className="text-center text-sm text-text-body font-semibold">
                    {text}
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => closeModal()}
                        disabled={loading}
                        className="px-4 py-1.5 bg-gray-200 hover:bg-gray-100 border border-border rounded-xs text-xs font-medium hover:cursor-pointer hover:shadow-sm"
                    >
                        No
                    </button>
                    <button
                        onClick={(): void => {
                            triggerConfirm();
                        }}
                        disabled={loading}
                        className="px-4 py-1.5 bg-btn-primary text-btn-text hover:bg-btn-hover hover:cursor-pointer rounded-xs text-xs font-medium hover:shadow-sm flex items-center justify-center"
                    >
                        {loading ? <Loading /> : "Yes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
