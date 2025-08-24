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

export const createArticleSchema=z.object({
    title:z.string().min(4),
    content:z.string().min(10),
})

export const articlesSchema = z.object({
    
    categories: z.nativeEnum(Categories),
});

