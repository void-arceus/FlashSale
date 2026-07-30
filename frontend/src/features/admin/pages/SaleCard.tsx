import { useState, useEffect } from "react";
import Loading from "../../../components/ui/Loading";

export interface CountDownTimer {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface SaleCardProps {
    data: any;
    loading: boolean;
    handleIsEditing: () => void;
    handleShowScheduleSaleForm: () => void;
    handleSetSaleToUpdate: (obj: any) => void;
    deleteHandler: (id: string) => void;
}

function SaleCard({
    data,
    loading,
    handleSetSaleToUpdate,
    handleShowScheduleSaleForm,
    deleteHandler,
    handleIsEditing,
}: SaleCardProps) {
    const [status, setStatus] = useState<string>("");
    const [deleteSaleId, setDeleteSaleId] = useState<string>("");

    const [countDown, setCountDown] = useState<CountDownTimer>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const start = new Date(data.flashSaleStartTime);
    const end = new Date(data.flashSaleEndTime);
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();

            // update status
            if (now < start) {
                setStatus("Upcoming");
            } else if (now > end) {
                setStatus("Ended");
            } else if (now > start && now < end) {
                setStatus("Ongoing");
            } else {
                setStatus("");
            }

            // if upcoming
            if (start > now) {
                const diff = start.getTime() - now.getTime();
                const { days, hours, minutes, seconds } =
                    getTimeRemaining(diff);
                setCountDown({ days, hours, minutes, seconds });
            } else if (start < now && end > now) {
                const diff = end.getTime() - now.getTime();
                const { days, hours, minutes, seconds } =
                    getTimeRemaining(diff);
                setCountDown({ days, hours, minutes, seconds });
            } else if (end < now) {
                setCountDown({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
                return;
            }
        };
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="w-full border border-border p-4 rounded-2xl shadow-md hover:shadow-lg hover:border-border-hover flex flex-col items-center gap-4">
            {/* status and countdown  */}
            <div className="w-full flex items-center justify-start gap-4 flex-wrap">
                <div
                    className={`${status.toLowerCase() === "upcoming" ? "bg-blue-100" : status.toLowerCase() === "ongoing" ? "bg-green-100" : status.toLowerCase() === "ended" ? "bg-red-200" : "bg-red-100"} flex items-center gap-2 px-4 py-2 rounded-lg`}
                >
                    <div
                        className={`${status.toLowerCase() === "upcoming" ? "bg-blue-600" : status.toLowerCase() === "ongoing" ? "bg-green-600" : status.toLowerCase() === "ended" ? "bg-red-600" : "bg-red-600"} h-3 w-3 rounded-full`}
                    />
                    <p
                        className={`${status.toLowerCase() === "upcoming" ? "text-blue-600" : status.toLowerCase() === "ongoing" ? "text-green-600" : status.toLowerCase() === "ended" ? "text-red-700" : "text-red-600"} text-sm font-semibold`}
                    >
                        {status}
                    </p>
                </div>
                {/* display timer */}
                <div className="flex-2 flex flex-col items-end justify-center">
                    <p>
                        {status === "Upcoming"
                            ? "Sale will start in:"
                            : status === "Ongoing"
                              ? "Sale will end in"
                              : ""}
                    </p>
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-black/90 rounded-lg">
                        <div className="bg-surface w-9 h-8 rounded-sm flex items-center justify-center">
                            <p className="text-text-main font-semibold text-sm">
                                {countDown.days + "d"}
                            </p>
                        </div>
                        <p className="text-lg font-medium text-primary-bg">:</p>
                        <div className="bg-surface w-9 h-8 rounded-sm flex items-center justify-center">
                            <p className="text-text-main font-semibold text-sm">
                                {(countDown.hours < 10
                                    ? "0" + countDown.hours
                                    : countDown.hours) + "h"}
                            </p>
                        </div>
                        <p className="text-lg font-medium text-primary-bg">:</p>
                        <div className="bg-surface w-9 h-8 rounded-sm flex items-center justify-center">
                            <p className="text-text-main font-semibold text-sm">
                                {(countDown.minutes < 10
                                    ? "0" + countDown.minutes
                                    : countDown.minutes) + "m"}
                            </p>
                        </div>
                        <p className="text-lg font-medium text-primary-bg">:</p>
                        <div className="bg-surface w-9 h-8 rounded-sm flex items-center justify-center">
                            <p className="text-text-main font-semibold text-sm">
                                {(countDown.seconds < 10
                                    ? "0" + countDown.seconds
                                    : countDown.seconds) + "s"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* product info */}
            <div className="w-full flex-2 flex flex-col items-start justify-center gap-1.5">
                <h2 className="text-lg font-bold text-text-main">
                    {data.productDetail.productName}
                </h2>
                <p className="text-sm text-text-main font-semibold">
                    Original Price: &nbsp;
                    <span className="text-sm text-text-muted font-semibold">
                        ₹
                        {new Intl.NumberFormat("en-IN").format(
                            data.productDetail.productOriginalPrice,
                        )}
                    </span>
                </p>
                <p className="text-sm text-text-main font-semibold">
                    Sale Price: &nbsp;
                    <span className="text-sm text-green-600 font-semibold">
                        ₹
                        {new Intl.NumberFormat("en-IN").format(
                            data.flashSalePrice,
                        )}
                    </span>
                </p>
                <p className="text-sm text-text-main font-semibold">
                    Quantity: &nbsp;
                    <span className="text-sm text-text-main font-bold">
                        {data.flashSaleQuantity}
                    </span>
                </p>
                <p className="text-sm text-text-main font-semibold">
                    Start time: &nbsp;
                    <span className="text-sm text-text-main font-semibold">
                        {formatDate(data.flashSaleStartTime)}
                    </span>
                </p>
                <p className="text-sm text-text-main font-semibold">
                    End time: &nbsp;
                    <span className="text-sm text-text-main font-semibold">
                        {formatDate(data.flashSaleEndTime)}
                    </span>
                </p>
            </div>
            <div className="w-full flex items-center justify-end gap-2">
                <button
                    onClick={() => {
                        if (handleShowScheduleSaleForm) {
                            handleIsEditing();
                            handleSetSaleToUpdate(data);
                            handleShowScheduleSaleForm();
                        }
                    }}
                    className="px-4 py-2 text-text-main text-sm font-medium hover:cursor-pointer hover:text-text-muted hover:underline"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setDeleteSaleId(data._id);
                        deleteHandler(data._id);
                    }}
                    className="px-4 py-2 bg-btn-primary hover:bg-btn-hover rounded-lg hover:cursor-pointer text-btn-text text-sm font-medium shadow-sm hover:shadow-lg active:scale-[0.96] transform-scale duration-200 ease-in-out flex items-center justify-center"
                >
                    {deleteSaleId === data._id && loading ? (
                        <Loading />
                    ) : (
                        "Delete"
                    )}
                </button>
            </div>
        </div>
    );
}

export default SaleCard;
