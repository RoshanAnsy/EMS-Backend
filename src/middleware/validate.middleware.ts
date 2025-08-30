import { Response, Request, NextFunction } from "express";
import { DateFilterSchema } from "../utils/zod.validate";
import { z } from "zod";

export const validateDateFilters = (req: Request, res: Response, next: NextFunction) => {
    try {
        DateFilterSchema.parse(req.query);
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            error: "Invalid date format. Use YYYY-MM-DD format.",
            details: error instanceof z.ZodError ? error.issues : error
        });
    }
};