// auth.controller.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(
    password: string,
    hash: string,
): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

// jwt payload interface
export interface UserPayload extends JwtPayload {
    id: string;
    role: string;
}

interface UserDataType {
    id: Types.ObjectId;
    username: string;
    email: string;
    role: string;
}

export const Register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const { role } = req.body || "user";

        // check if the user already exists
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(409).json({
                status: false,
                message: "Email is already linked to an account",
            });
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: role,
        });
        return res.status(201).json({
            status: true,
            message: "User Registered Successfully",
            data: { username: username, email: email } as UserDataType,
        });
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};

export const Login = async (
    req: Request,
    res: Response,
): Promise<Response | any> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid Email or Password",
            });
        }
        // compare password
        if (!(await verifyPassword(password, user.password as string))) {
            return res
                .status(401)
                .json({ status: false, message: "Invalid Email or Password" });
        }

        // create jwt token
        const payload: UserPayload = {
            id: user._id.toString(),
            role: user.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d",
        });

        // create cookie
        res.cookie("Token", token, { maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            status: true,
            message: "Logged in Successfully",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            } as UserDataType,
        });
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.Token;
        if (!token) {
            return res
                .status(400)
                .json({ status: false, message: "Bad Request" });
        }
        res.clearCookie("Token");
        return res.status(200).json({ status: true, message: "Logged out" });
    } catch (error: any) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error!" });
    }
};

export const getCurrentUser = async (
    req: Request,
    res: Response,
): Promise<Response | any> => {
    try {
        const token = req.cookies?.Token || null;
        if (!token) {
            return res.status(403).json({
                status: false,
                message: "No user found",
            });
        }
        const verify = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string,
        ) as { id: string };
        if (!verify) {
            return res
                .status(403)
                .json({ status: false, message: "No token provided" });
        }

        // get user data from database
        const user = await User.findById(verify.id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            status: true,
            message: "User is logged in",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};
