// auth.route.ts
import { Request, Response } from "express";

import express, { Router } from "express";
import {
    validateRegister,
    validateLogin,
} from "../middlewares/validate.middleware";
import { authUser, authAdmin } from "../middlewares/auth.middleware";
import {
    Register,
    Login,
    logout,
    getCurrentUser,
} from "../controllers/auth.controller";

const authRouter: Router = express.Router();

authRouter.post("/register", validateRegister, Register);
authRouter.post("/login", validateLogin, Login);
authRouter.post("/logout", logout);
authRouter.get("/me", getCurrentUser);

export default authRouter;
