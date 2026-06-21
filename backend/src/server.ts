import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRouter from "./routes/auth.route";
import cookieParser = require("cookie-parser");
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// json parser middleware
app.use(express.json());
app.use(cookieParser());

// testing
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Flash Sale is running" });
});

// routes
app.use("/v1/auth", authRouter);

// connect to db
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT: ${PORT}`);
    });
});
