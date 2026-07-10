import { useState, useEffect } from "react";
import Loading from "../../../components/ui/Loading";
import type { FlashSaleInput } from "../../admin/pages/ScheduleSaleForm";
import { getSales } from "../../products/services/flashsaleService";
import UserSaleCard from "./UserSaleCard";

function Sales() {
    const [sales, setSales] = useState<FlashSaleInput[] | []>([]);
    const [saleLoading, setSaleLoading] = useState<boolean>(false);

    useEffect(() => {
        handleGetSales();
    }, []);

    async function handleGetSales() {
        try {
            setSaleLoading(true);
            const res = await getSales();
            if (res.status === true) {
                setSales(res.data as FlashSaleInput[]);
            } else {
                console.log(res.message);
            }
        } catch (error: any) {
            setSaleLoading(false);
        } finally {
            setSaleLoading(false);
        }
    }

    return (
        <main className="w-full flex flex-col items-center">
            {saleLoading ? (
                <div className="h-screen w-full flex items-center justify-center bg-black/10">
                    <Loading size={5} />
                </div>
            ) : sales.length == 0 ? (
                <section className="pt-16 w-full max-w-6xl flex items-center justify-center">
                    <p className="text-md font-medium text-text-muted">
                        No sales found, Check back soon!
                    </p>
                </section>
            ) : (
                <section className="pt-16 w-full max-w-6xl p-4 flex flex-col gap-2">
                    <div>
                        <h1 className="text-xl text-text-main font-semibold">
                            All Sales
                        </h1>
                    </div>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sales.map((sale) => (
                            <UserSaleCard key={sale._id} data={sale} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

export default Sales;
