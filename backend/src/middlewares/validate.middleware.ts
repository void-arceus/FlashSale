// validate.middleware.ts

import { Request, Response, NextFunction } from "express";
import {
    validateRegisterData,
    validateLoginData,
} from "../validators/auth.validator";

export const validateRegister = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { username, email, password, confirmPassword } = req.body || {};
        const result = validateRegisterData(
            username,
            email,
            password,
            confirmPassword,
        );
        if (result?.status === false) {
            return res
                .status(400)
                .json({ status: false, message: result.message });
        }
        return next();
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};

export const validateLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password } = req.body || {};
        const result = validateLoginData(email, password);
        if (result?.status === false) {
            return res
                .status(400)
                .json({ status: false, message: result.message });
        }
        return next();
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};
