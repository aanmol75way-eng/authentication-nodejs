import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const checkToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                status: 1,
                msg: "please fill the token",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                status: 1,
                msg: "please fill the token",
            });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.TOKENKEY as string
        ) as JwtPayload;

        if (decoded) {
            const { id } = decoded as { id: string };
            req.body.id = id;
            return next();
        }

        res.status(401).json({
            status: 0,
            msg: "please fill the correct token",
        });
    } catch (error) {
        res.status(401).json({
            status: 0,
            msg: "please fill the correct token",
        });
    }
};
