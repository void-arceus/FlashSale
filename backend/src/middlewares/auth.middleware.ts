import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; role: string };
        }
    }
}

const getDecoded = (req: Request, res: Response) => {
    const token = req.cookies?.Token || null;
    if (!token) {
        return res.status(403).json({
            status: false,
            message: "Access Denied: Token not Provided",
        });
        return null;
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string,
        ) as { id: string; role: string };
        req.user = decoded;
        return decoded;
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(403)
            .json({ status: false, message: "Invalid or Expired Token" });
        return null;
    }
};

export const authUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const decoded = getDecoded(req, res) as { id: string; role: string };
        if (!decoded) return;
        if (decoded.role !== "user") {
            return res.status(401).json({
                status: false,
                message: "Access Denied! Unauthorized",
            });
        }
        return next();
    } catch (error: any) {
        console.error(error.message);
        return res.status(403).json({ status: false, messge: "Unauthorized" });
    }
};

export const authAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const decoded = getDecoded(req, res) as { id: string; role: string };
        if (!decoded) return;
        if (decoded.role !== "admin") {
            return res.status(401).json({
                status: false,
                message: "Access Denied! Unauthorized",
            });
        }
        return next();
    } catch (error: any) {
        console.error(error.message);
        return res.status(403).json({ status: false, message: "Unauthorized" });
    }
};
