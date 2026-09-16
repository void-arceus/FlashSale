import { type Response } from "express";
import { handlePurchaseProduct } from "../controllers/purchase.controller";

interface IRequest {
    userId: string;
    saleId: string;
    res: Response;
}

const worker: IRequest[] = [];
let workerRunning: boolean = false;

export function addRequestToWorker(data: IRequest) {
    worker.push(data);
}

export function clearSaleWorker() {
    while (worker.length > 0) {
        const req = worker.shift();
        if (!req) break;
        req?.res.status(409).json({
            status: false,
            message: "OUT OF STOCK!",
        });
    }
    workerRunning = false;
    return;
}

export async function resolveRequest() {
    if (workerRunning) return;
    workerRunning = true;
    while (worker.length > 0) {
        // try to resolve the current request
        const req = worker.shift();
        if (!req) break;
        console.log("Worker queue length:", worker.length);
        console.log("Resolving request...");
        const response = await handlePurchaseProduct(
            req?.saleId as string,
            req?.userId as string,
        );
        if (response?.statusCode === 400) {
            worker.push(req);
        } else {
            req.res.status(Number(response?.statusCode)).json({
                status: response?.status,
                message: response?.message,
            });
        }
    }
    workerRunning = false;
}
