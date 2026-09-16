import { useEffect, useState } from "react";
import { getUserOrders } from "../../../services/orders.service";
import { type IProduct } from "../../products/services/productService";

interface IUserOrders {
    _id: string;
    orderQuantity: number;
    orderPrice: number;
    orderStatus: "PENDING" | "COMPLETED" | "FAILED";
    orderType: "NORMAL" | "FLASHSALE";
    createdAt: Date;
    updatedAt: Date;
    productDetail: IProduct;
}
function MyOrders() {
    const [orders, setOrders] = useState<IUserOrders[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const customOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    useEffect(() => {
        handleGetUserOrders();
    }, []);

    async function handleGetUserOrders() {
        try {
            const res = await getUserOrders("6a3524f7230f249626335044");
            console.log(res.data.orders);
            setOrders(res.data.orders);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    return (
        <main className="h-screen w-full pt-14 flex items-center justify-center px-4">
            <div className="flex flex-col w-full max-w-6xl h-full">
                <div className="w-full flex items-center justify-start py-2">
                    <h1 className="text-md font-semibold text-text-main">
                        My Orders
                    </h1>
                </div>
                <div className="flex-1 w-full flex flex-col items-center gap-2">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div
                                className="flex items-center gap-2 h-40 w-full p-2 rounded-lg shadow-md border border-gray-200"
                                key={order._id}
                            >
                                <div className="h-full w-30 flex items-center justify-center">
                                    <img
                                        src={
                                            order?.productDetail
                                                ?.productImageUrl
                                        }
                                        className="h-full w-26 rounded-sm shadow-md"
                                    />
                                </div>
                                <div className="flex-3 flex flex-col h-full justify-between item-start border-r border-gray-100">
                                    <div className="flex flex-col">
                                        <h2 className="text-md font-semibold text-text-main">
                                            {order.productDetail.productName}
                                        </h2>
                                        <p className="text-sm font-medium text-text-muted line-clamp-5">
                                            {
                                                order.productDetail
                                                    .productDescription
                                            }
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-sm font-semibold text-text-main">
                                            Purchase Date:
                                        </h2>
                                        <span className="text-sm font-medium text-text-muted">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleString(
                                                "en-US",
                                                customOptions,
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-full flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-sm font-semibold text-text-main">
                                            Price:
                                        </h2>
                                        <span className="text-sm font-medium text-text-muted">
                                            ₹{order.orderPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-sm font-semibold text-text-main">
                                            Type:
                                        </h2>
                                        <span className="text-sm font-semibold text-text-muted">
                                            {order.orderType}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-text-main">
                                            Quantity:
                                        </p>
                                        <span className="text-sm font-medium text-text-muted">
                                            {order.orderQuantity}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full">
                            <p>Oops! No Orders found</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default MyOrders;
