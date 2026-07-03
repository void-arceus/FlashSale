import { useEffect } from "react";

export default function SaleCoordinator() {
    // get the product names and original price
    useEffect(() => {}, []);

    return (
        <main className="h-screen w-full pt-18 flex flex-col items-center gap-6">
            {/* header */}
            <section className="h-fit w-full max-w-6xl flex flex-col items-center justify-center gap-2">
                <h1 className="text-xl text-text-main font-semibold">
                    Flash Sale Coordinator
                </h1>
                <p className="text-sm font-medium text-text-muted">
                    Manage your timed store promotions and active countdowns
                    here.
                </p>
            </section>

            {/* start new sale and view on going or scheduled sales  */}
            <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 p-4 gap-6">
                <div className="h-fit w-full border border-border rounded-xl p-3 flex flex-col items-center gap-4 shadow-lg">
                    <h1>Schedule New Sale</h1>
                    <div>
                        <h2>Product Name will appear here</h2>
                    </div>
                    <div>
                        <p>Set Sale start time</p>
                    </div>
                    <div>
                        <p>set sale end time</p>
                    </div>
                    <div className="w-full flex items-center justify-end">
                        <button className="px-4 py-2 bg-btn-primary hover:bg-btn-hover hover:cursor-pointer rounded-lg text-btn-text active:scale-[0.981] transition-scale duration-200 ease-in-out">
                            Schedule Sale
                        </button>
                    </div>
                </div>
                <div className="h-fit w-full border border-border rounded-xl p-2 shadow-lg">
                    View ongoing and existing sales with timer
                </div>
            </section>
        </main>
    );
}
