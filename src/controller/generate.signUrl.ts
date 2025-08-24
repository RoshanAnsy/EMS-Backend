import  { Response, Request} from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import crypto from "crypto";


dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const GenerateSignUrl = async (req:Request, res:Response) => {

    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `uploads/${crypto.randomUUID()}`;

        const signature = cloudinary.utils.api_sign_request(
            { timestamp, public_id: publicId },
        process.env.CLOUDINARY_API_SECRET as string
        );

        res.status(200).json({
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            timestamp,
            signature,
            publicId,
        });
           
    }

    catch(error){
        // console.error("Error generating signed URL:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error? error.message : error
        });
    }
}

export {GenerateSignUrl}