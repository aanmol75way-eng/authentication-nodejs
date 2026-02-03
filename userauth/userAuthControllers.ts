import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { userAuthModel } from "./userAuthModel";
import { sendVerificationEmail } from "../config/emailService";
import { createError } from "../common/createError";
import { registerInput, registerSchema } from "./schemaAuth";

const SALT_ROUNDS = 10;

export const userRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData: registerInput = registerSchema.parse(req.body);

        const { userName, userEmail, userPassword } = req.body;
        const existingUser = await userAuthModel.findOne({ userEmail });
        if (existingUser) {
            return next(createError("Email already exists", 409));
        }

        const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS);

        const verifyToken = crypto.randomBytes(32).toString("hex");
        const hashedVerifyToken = crypto
            .createHash("sha256")
            .update(verifyToken)
            .digest("hex");

        await userAuthModel.create({
            userName,
            userEmail,
            userPassword: hashedPassword,
            emailVerifyToken: hashedVerifyToken,
            emailVerifyExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        });

        const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
        await sendVerificationEmail(userEmail, verifyLink);

        res.status(201).json({
            success: true,
            message: "Account created. Please verify your email.",
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { token } = req.params;

        if (typeof token !== "string") {
            return next(createError("Invalid or missing token", 400));
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await userAuthModel.findOne({
            emailVerifyToken: hashedToken,
            emailVerifyExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(createError("Invalid or expired token", 400));
        }

        user.isEmailVerified = true;
        user.emailVerifyToken = undefined;
        user.emailVerifyExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await userAuthModel
            .findOne({ userEmail })
            .select("+userPassword");

        if (!user) {
            return next(createError("Invalid email or password", 401));
        }

        if (!user.isEmailVerified) {
            return next(createError("Please verify your email", 403));
        }

        const isMatch = await bcrypt.compare(
            userPassword,
            user.userPassword
        );

        if (!isMatch) {
            return next(createError("Invalid email or password", 401));
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.TOKENKEY as string,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        next(error);
    }
};

export const forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userEmail, newPassword } = req.body;
        const user = await userAuthModel.findOne({ userEmail });
        if (!user) {
            return next(createError("Invalid email", 404));
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        user.userPassword = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        next(error);
    }
};
