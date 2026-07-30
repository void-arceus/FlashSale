import { useState, useEffect } from "react";
import ScheduleSaleForm, { type IFlashSale } from "./ScheduleSaleForm";
import { useAuth } from "../../../context/AuthContext";
import { getAdminSales } from "../../products/services/flashsaleService";
import SaleCard from "./SaleCard";
import { deleteSale } from "../../products/services/flashsaleService";
import { useToast } from "../../../context/ToastContext";
import { useConfirmation } from "../../../context/ConfirmationContext";

export interface SaleDataInterface {
    _id: string;
    productId: string;
    adminId: string;
    originalPrice: number;
    salePrice: number;
    saleStartTime: Date;
    saleEndTime: Date;
    saleQuantity: number;
}

function SaleCoordinator() {
    const [showScheduleSaleForm, setShowScheduleSaleForm] =
        useState<boolean>(false);
    const [saleData, setSaleData] = useState<IFlashSale[] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { showToaster } = useToast();
    const { showConfirmation } = useConfirmation();
    const { user } = useAuth();

    // states for editing the existing sale
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [saleToUpdate, setSaleToUpdate] = useState<IFlashSale | null>(null);

    const handleSetSaleToUpdate = (obj: any) => {
        setSaleToUpdate(obj);
    };

    function handleIsEditing() {
        setIsEditing((prev) => !prev);
    }

    async function handleUpdateSaleData(obj: IFlashSale) {
        setSaleData((prev) =>
            prev.map((sale) => (sale._id === obj._id ? obj : sale)),
        );
    }

    function handleShowScheduleSaleForm() {
        setShowScheduleSaleForm((prev) => !prev);
    }

    useEffect(() => {
        handleGetAdminSales();
    }, []);

    function deleteHandler(id: string) {
        showConfirmation(
            "Are you sure you want to delete this sale? This action cannot be undone",
            () => handleDeleteSale(id),
        );
    }

    async function handleDeleteSale(id: string) {
        try {
            setLoading(true);
            const res = await deleteSale(id);
            if (res.status === true) {
                setSaleData((prev: any) =>
                    prev.filter((data: any) => data._id !== id),
                );
                showToaster(res.message, "success");
            } else {
                showToaster(res.message, "error");
            }
        } catch (error: any) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleGetAdminSales = async () => {
        try {
            if (user) {
                const res = await getAdminSales(user?.id);
                const sorted = res.data?.toSorted(
                    (a: IFlashSale, b: IFlashSale): any => {
                        new Date(a.flashSaleStartTime) >
                            new Date(b.flashSaleStartTime);
                    },
                );
                setSaleData(sorted as IFlashSale[]);
            }
        } catch (error: any) {
            setSaleData([]);
        }
    };

    function appendNewSaleData(obj: any) {
        setSaleData((prev: any) => [obj, ...prev]);
    }

    return (
        <main className="relative h-screen w-full flex flex-col items-center">
            {/* header */}
            {showScheduleSaleForm ? (
                <ScheduleSaleForm
                    handleShowScheduleSaleForm={handleShowScheduleSaleForm}
                    appendNewSaleData={appendNewSaleData}
                    isEditing={isEditing}
                    handleIsEditing={handleIsEditing}
                    saleToUpdate={saleToUpdate}
                    handleUpdateSaleData={handleUpdateSaleData}
                />
            ) : null}
            <section className="w-full max-w-6xl pt-18 px-4 flex flex-col items-center gap-4">
                <div className="w-full flex xs:flex-row xs:items-center xs:justify-between flex-col gap-2 items-start justify-center">
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

                <hr className="w-full border border-border" />

                {saleData ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        {saleData.map((data: any) => (
                            <SaleCard
                                key={data._id}
                                data={data}
                                loading={loading}
                                handleSetSaleToUpdate={handleSetSaleToUpdate}
                                handleShowScheduleSaleForm={
                                    handleShowScheduleSaleForm
                                }
                                deleteHandler={deleteHandler}
                                handleIsEditing={handleIsEditing}
                            />
                        ))}
                    </div>
                ) : (
                    <div>No Sales Found!</div>
                )}
            </section>
        </main>
    );
}

export default SaleCoordinator;
