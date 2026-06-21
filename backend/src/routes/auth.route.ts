// auth.route.ts
import { Request, Response } from "express";

import express, { Router } from "express";
import {
    validateRegister,
    validateLogin,
} from "../middlewares/validate.middleware";
import { authUser, authAdmin } from "../middlewares/auth.middleware";
import { Register, Login, logout } from "../controllers/auth.controller";

const authRouter: Router = express.Router();

authRouter.post("/register", validateRegister, Register);
authRouter.post("/login", validateLogin, Login);
authRouter.post("/logout", logout);

// testing routes
authRouter.get("/user", authUser, (req: Request, res: Response) => {
    return res.status(200).json({
        status: true,
        message: "Welcome user!",
    });
});
authRouter.get("/admin", authAdmin, (req: Request, res: Response) => {
    return res.status(200).json({ status: true, message: "Welcome Admin!" });
});

export default authRouter;
