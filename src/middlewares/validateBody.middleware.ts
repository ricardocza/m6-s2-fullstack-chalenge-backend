import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { AppError } from "../error";

const validateBody = 
    (schema: ZodTypeAny) => 
    (req: Request, res: Response, next: NextFunction) => {
        const validate = schema.parse(req.body)
        req.body = validate
        return next()
}

export default validateBody