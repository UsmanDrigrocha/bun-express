import type { Response } from "express";

export const asyncHandler = (fn: any) => {
    return async (req: any, res: Response, next: any) => {
        try { 
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};