import mongoose, { Schema, Document } from "mongoose";

interface user extends Document {
    username: String;
    email: String;
    password: String;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<user>(
    {
        username: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
    },
    { timestamps: true },
);

const User = mongoose.model<user>("User", userSchema);

export default User;
