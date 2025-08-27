import {z} from "zod";
import { Categories } from "../types/auth.types";
export const signUpZodSchema=z.object({
    name:z.string().min(3),
    email:z.string().email(),
    password:z.string().min(8),
    conformPassword:z.string().min(8),
})

export const loginZodSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8),
})

// export const AttendanceZodSchema=z.object({
//     PunchInLocation: z.string().min(3),
//     PunchOutLocation: z.string().min(3).optional(),
// })

export const PunchInZodSchema = z.object({
    PunchInLocation: z.string().min(3),
});

export const PunchOutZodSchema = z.object({
    PunchOutLocation: z.string().min(3),
});

export const createArticleSchema=z.object({
    title:z.string().min(4),
    content:z.string().min(10),
})

export const articlesSchema = z.object({
    
    categories: z.nativeEnum(Categories),
});



export const DateFilterSchema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
});