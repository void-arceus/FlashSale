import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IFlashSale } from "../../admin/pages/ScheduleSaleForm";
import type { CountDownTimer } from "../../admin/pages/SaleCard";

interface UserSaleCardProps {
    data: IFlashSale;
}

function UserSaleCard({ data }: UserSaleCardProps) {
    const [status, setStatus] = useState<string>("");
    const [countDown, setCountDown] = useState<CountDownTimer>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const navigate = useNavigate();
    const startTime = new Date(data.flashSaleStartTime);
    const endTime = new Date(data.flashSaleEndTime);

    useEffect(() => {
        function updateTimer() {
            const now = new Date();
            if (now < startTime) {
                setStatus("upcoming");
            } else if (now > endTime) {
                setStatus("ended");
            } else if (now > startTime && now < endTime) {
                setStatus("ongoing");
            } else {
                setStatus("");
            }

            if (startTime > now) {
                const diff = startTime.getTime() - now.getTime();
                const { days, hours, minutes, seconds } =
                    getTimeRemaining(diff);
                setCountDown({ days, hours, minutes, seconds });
            } else if (startTime < now && endTime > now) {
                const diff = endTime.getTime() - now.getTime();
                const { days, hours, minutes, seconds } =
                    getTimeRemaining(diff);
                setCountDown({ days, hours, minutes, seconds });
            } else if (endTime < now) {
                setCountDown({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
                return;
            }
        }
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [status]);

    const getTimeRemaining = (diff: number) => {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    };

    return (
        <div className="w-full border border-border rounded-2xl p-3 shadow-md hover:shadow-lg flex flex-col gap-3">
            {/* image */}
            <div className="w-full overflow-hidden rounded-xl">
                <img
                    src={data.productDetail?.productImageUrl}
                    alt={data.productDetail?.productName}
                    className="h-80 w-full object-center object-cover rounded-xl hover:scale-105 transition-scale duration-200 ease-in"
                />
            </div>

            {/* product name */}
            <div className="w-full flex sm:flex-row flex-col sm:items-center items-start sm:justify-between justify-center">
                <h1 className="flex-1 text-md font-semibold text-text-main">
                    {data.productDetail?.productName}
                </h1>
                <div className="flex-2 flex items-center justify-end gap-2">
                    {/* display sale timer */}
                    <p
                        className={`${status === "upcoming" ? "bg-blue-100 text-blue-600" : status === "ongoing" ? "bg-green-100 text-green-600" : status === "ended" ? "bg-red-100 text-red-600" : ""} text-md font-medium px-2 py-1 rounded-md`}
                    >
                        {status === "upcoming"
                            ? "Starts in"
                            : status === "ongoing"
                              ? "Ends in"
                              : status === "ended"
                                ? "Sale has Ended"
                                : ""}
                    </p>
                    {status !== "ended" ? (
                        <div className="flex items-center">
                            <div className="w-9">
                                {countDown.days < 10
                                    ? "0" + countDown.days
                                    : countDown.days}
                                d
                            </div>
                            <div className="w-8">
                                {countDown.hours < 10
                                    ? "0" + countDown.hours
                                    : countDown.hours}
                                h
                            </div>
                            <div className="w-9">
                                {countDown.minutes < 10
                                    ? "0" + countDown.minutes
                                    : countDown.minutes}
                                m
                            </div>
                            <div className="w-8">
                                {countDown.seconds < 10
                                    ? "0" + countDown.seconds
                                    : countDown.seconds}
                                s
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* price */}
            {status !== "ended" ? (
                <div className="w-full flex items-center justify-between">
                    <div className="w-full flex items-center flex-wrap justify-start text-md font-semibold text-text-main">
                        <p>Original Price:</p> &nbsp;
                        <span className="line-through text-red-700">
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                                Number(
                                    data.productDetail?.productOriginalPrice,
                                ),
                            )}
                        </span>
                    </div>
                    <div className="w-full flex flex-wrap items-center justify-end text-md font-semibold text-text-main">
                        <p>Sale Price:</p> &nbsp;
                        <span className="text-green-600">
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                                Number(data.flashSalePrice),
                            )}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="w-full flex items-center justify-start">
                    <h2 className="text-semibold text-sm text-text-main">
                        Price: &nbsp;
                    </h2>
                    <p className="text-sm text-medium text-text-muted">
                        ₹
                        {new Intl.NumberFormat("en-IN").format(
                            Number(data.productDetail?.productOriginalPrice),
                        )}
                    </p>
                </div>
            )}
            <div className="w-full flex items-center justify-between">
                <button
                    onClick={() => {
                        navigate(`/productDetail/${data._id}`);
                    }}
                    className="text-sm font1-semibold text-text-muted hover:cursor-pointer hover:underline"
                >
                    view details
                </button>
                <button
                    disabled={status.toLowerCase() !== "ongoing"}
                    onClick={() => console.log("I am buy button.")}
                    className={`${status.toLowerCase() != "ongoing" ? "opacity-70 cursor-not-allowed" : "hover:bg-btn-hover hover:cursor-pointer  shadow-sm hover:shadow-md active:scale-[0.96] transition-scale duration-200 ease-in-out"} px-4 py-2 text-sm text-btn-text font-medium bg-btn-primary rounded-lg `}
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}

export default UserSaleCard;
