import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import { getSaleDetail } from "../../products/services/flashsaleService";
import type { FlashSaleInput } from "../../admin/pages/ScheduleSaleForm";
import type { CountDownTimer } from "../../admin/pages/SaleCard";

function ProductDetail() {
    const { id } = useParams();
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [data, setData] = useState<FlashSaleInput | null>(null);
    const [status, setStatus] = useState<string>("");

    const [countDown, setCountDown] = useState<CountDownTimer>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        // get the product Details here...
        handleGetProductInfo();
    }, []);

    useEffect(() => {
        function updateTimer() {
            if (!data?.saleStartTime || !data?.saleEndTime) return;
            const startTime = new Date(data?.saleStartTime);
            const endTime = new Date(data?.saleEndTime);

            const now = new Date();
            let currentStatus = "ended";
            if (now < startTime) currentStatus = "upcoming";
            else if (now >= startTime && now <= endTime) {
                currentStatus = "ongoing";
            }
            setStatus((prevStatus) =>
                prevStatus !== currentStatus ? currentStatus : prevStatus,
            );

            if (currentStatus === "upcoming") {
                const diff = startTime.getTime() - now.getTime();
                const { days, hours, minutes, seconds } =
                    getTimeRemaining(diff);
                setCountDown({ days, hours, minutes, seconds });
            } else if (currentStatus === "ongoing") {
                const diff = endTime.getTime() - now.getTime();
                const { days, hours, minutes, seconds } =
                    getTimeRemaining(diff);
                setCountDown({ days, hours, minutes, seconds });
            } else {
                setCountDown({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
            }
        }
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [data]);

    const getTimeRemaining = (diff: number) => {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    };

    async function handleGetProductInfo() {
        try {
            setPageLoading(true);
            const res = await getSaleDetail(id as string);
            setData(res.data as FlashSaleInput);
        } catch (error: any) {
            setPageLoading(false);
        } finally {
            setPageLoading(false);
        }
    }

    return (
        <main className="w-full flex items-center justify-center">
            {pageLoading ? (
                <div className="h-screen w-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <section className="w-full max-w-6xl pt-12 flex items-center justify-center">
                    <div className="w-full flex md:flex-row flex-col md:items-start gap-2 p-2 overflow-hidden">
                        {/* image div — Added 'group' and 'z-0' */}
                        <div className="group relative w-full h-180 rounded-lg overflow-hidden p-2 z-0">
                            <img
                                src={data?.productDetail?.url}
                                alt={data?.productDetail?.productName}
                                className="h-full w-full rounded-2xl shadow-md object-cover transition-transform duration-300 ease-in "
                            />

                            <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors duration-300 rounded-2xl m-2 pointer-events-none" />
                        </div>

                        {/* other details div */}
                        <div className="w-full">
                            {/* sale detail */}
                            {status === "ended" ? (
                                <div className="w-full flex items-center">
                                    <div className="" />
                                    <p className="text-sm font-medium text-red-600">
                                        Ended
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full p-2 flex items-center justify-end">
                                    <div>
                                        <div />
                                        <p>
                                            {status === "upcoming"
                                                ? "Sale starts in :"
                                                : status === "ongoing"
                                                  ? "Sale Ends in :"
                                                  : "Sale has Ended"}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* product name and details */}
                            <div className="w-full flex flex-col items-start justify-center gap-2">
                                <h2 className="text-lg font-semibold text-text-main">
                                    {data?.productDetail?.productName}
                                </h2>
                                <p className="text-sm font-medium text-text-muted">
                                    {data?.productDetail?.description}
                                </p>
                            </div>
                            <div className="w-full flex items-center justify-end p-2">
                                <button
                                    disabled={status !== "ongoing"}
                                    className={`${status !== "ongoing" ? "opacity-60" : "hover:bg-btn-hover hover:cursor-pointer shadow-sm hover:shadow-md active:scale-[0.96] transition-transform duration-100 ease-in-out"} px-4 py-2 text-sm font-medium text-btn-text bg-btn-primary rounded-lg`}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

export default ProductDetail;
