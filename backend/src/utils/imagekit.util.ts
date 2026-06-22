// imagekit.util.ts

import { ImageKit } from "@imagekit/nodejs/client.js";

// upload results
interface UploadResults {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl: string;
}

export const uploadImage = async (
    fileBuffer: Buffer,
    fileName: string,
    folder: string = "/FlashSale",
): Promise<UploadResults> => {
    try {
        const client = new ImageKit({
            privateKey: process.env.IMAGEKIT_SECRET_KEY,
        });
        const response = await client.files.upload({
            file: fileBuffer.toString("base64"),
            fileName: fileName,
            folder: folder,
        });
        return {
            fileId: response.fileId || "",
            name: response.name || "",
            url: response.url || "",
            thumbnailUrl: response.thumbnailUrl || "",
        };
    } catch (error: any) {
        console.error("ImageKit Upload Error: ", error.message);
        throw new Error(error.message || "Failed to upload image");
    }
};
