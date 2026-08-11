import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import { getSaleDetail } from "../../products/services/flashsaleService";
import type { IFlashSale } from "../../admin/pages/ScheduleSaleForm";
import type { CountDownTimer } from "../../admin/pages/SaleCard";

function ProductDetail() {
    const { id } = useParams();
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [data, setData] = useState<IFlashSale | null>(null);
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
            if (!data?.flashSaleStartTime || !data?.flashSaleEndTime) return;
            const startTime = new Date(data?.flashSaleStartTime);
            const endTime = new Date(data?.flashSaleEndTime);

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
            setData(res.data as IFlashSale);
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
                                src={data?.productDetail?.productImageUrl}
                                alt={data?.productDetail?.productName}
                                className="h-full w-full rounded-2xl shadow-md object-cover transition-transform duration-300 ease-in "
                            />

                            <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors duration-300 rounded-2xl m-2 pointer-events-none" />
                        </div>

                        {/* other details div */}
                        <div className="w-full flex flex-col items-start gap-4">
                            {/* sale detail */}
                            {status === "ended" ? (
                                <div className="w-fit flex items-center bg-red-100 gap-1 py-2  px-3 rounded-lg">
                                    <div className="h-4 w-4 rounded-full bg-red-600" />
                                    <p className="text-sm font-medium text-red-600">
                                        Sale has Ended
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full pt-2 flex items-center justify-start gap-4">
                                    <div
                                        className={`${status === "ongoing" ? "bg-green-100" : status === "upcoming" ? "bg-blue-100" : "bg-red-200"} px-2 py-1.5 flex items-center gap-1 rounded-lg`}
                                    >
                                        <div
                                            className={`${status === "upcoming" ? "bg-blue-600" : ""} h-4 w-4 rounded-full`}
                                        />
                                        <p
                                            className={`${status === "ongoing" ? "text-green-600" : status === "upcoming" ? "text-blue-600" : "text-red-600"} text-sm font-medium`}
                                        >
                                            {status === "upcoming"
                                                ? "Sale starts in :"
                                                : status === "ongoing"
                                                  ? "Sale Ends in :"
                                                  : "Sale has Ended"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-text-main">
                                                {countDown.days}
                                            </p>
                                            <p className="text-sm font-medium text-text-main">
                                                d
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-text-main">
                                                {countDown.hours}
                                            </p>
                                            <p className="text-sm font-medium text-text-main">
                                                h
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-text-main">
                                                {countDown.minutes}
                                            </p>
                                            <p className="text-sm font-medium text-text-main">
                                                m
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-text-main">
                                                {countDown.seconds}
                                            </p>
                                            <p className="text-sm font-medium text-text-main">
                                                s
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* product name and details */}
                            <div className="w-full flex flex-col items-start justify-center gap-2">
                                <h2 className="text-xl font-semibold text-text-main">
                                    {data?.productDetail?.productName}
                                </h2>
                                <p className="text-md font-medium text-text-muted leading-6 text-justify">
                                    {data?.productDetail?.productDescription}
                                </p>
                            </div>

                            {/* price details */}
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-md font-semibold text-text-main">
                                        Sale Price:
                                    </h2>
                                    <p className="text-md text-green-600 font-semibold">
                                        ₹{data?.flashSalePrice}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-md font-semibold text-text-muted">
                                        Original Price:
                                    </h2>
                                    <p className="text-md font-semibold text-red-700 line-through">
                                        ₹
                                        {
                                            data?.productDetail
                                                ?.productOriginalPrice
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="w-full flex items-center justify-end p-2">
                                <button
                                    disabled={status !== "ongoing"}
                                    className={`${status !== "ongoing" ? "opacity-60 cursor-not-allowed" : "hover:bg-btn-hover hover:cursor-pointer shadow-sm hover:shadow-md active:scale-[0.96] transition-transform duration-100 ease-in-out"} px-4 py-2 text-sm font-medium text-btn-text bg-btn-primary rounded-lg`}
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
