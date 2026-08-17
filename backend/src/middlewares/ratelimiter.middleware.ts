import rateLimit from "express-rate-limit";

export const purchaseRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 429,
        message: "Too many requests",
    },
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
