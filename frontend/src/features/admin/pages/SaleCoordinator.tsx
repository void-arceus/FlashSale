import { useState } from "react";
import ScheduleSaleForm from "./ScheduleSaleForm";

function SaleCoordinator() {
    const [showScheduleSaleForm, setShowScheduleSaleForm] =
        useState<boolean>(false);

    const handleShowScheduleSaleForm = () => {
        setShowScheduleSaleForm((prev) => !prev);
    };

    return (
        <main className="relative h-screen w-full flex flex-col items-center">
            {/* header */}
            {showScheduleSaleForm ? (
                <ScheduleSaleForm
                    handleShowScheduleSaleForm={handleShowScheduleSaleForm}
                />
            ) : null}
            <section className="w-full max-w-6xl pt-16 px-4 ">
                <div className="flex flex-col gap-3 items-start justify-center">
                    <h1 className="text-lg text-text-primary font-semibold">
                        Sale Coordinator
                    </h1>
                    <button
                        onClick={handleShowScheduleSaleForm}
                        className="px-4 py-2 bg-btn-primary hover:bg-btn-hover rounded-lg text-btn-text text-sm font-medium hover:cursor-pointer shadow-sm hover:shadow-md active:scale-[0.96] transition-scale duration-200 ease-in-out"
                    >
                        Schedule Sale +
                    </button>
                </div>
            </section>
        </main>
    );
}

export default SaleCoordinator;
