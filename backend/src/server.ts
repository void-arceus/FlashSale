import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import cookieParser = require("cookie-parser");
import cors, { CorsOptions } from "cors";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// json parser middleware
app.use(express.json());
app.use(cookieParser());

// cors setup
const allowedOrigins = ["http://localhost:5173"];
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        else {
            callback(new Error("Not allowed by CORS!"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors<Request>(corsOptions));

// testing
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Flash Sale is running" });
});

// routes
app.use("/v1/auth", authRouter);
app.use("/v1/product", productRouter);

// connect to db
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT: ${PORT}`);
    });
});
