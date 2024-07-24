import { IncomingHttpHeaders } from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import UserModel from "../Models/UserModel";
import CryptoJS from "crypto-js";
import { escapeInput, logger } from "./Utils";

dotenv.config();

export type Headers = IncomingHttpHeaders & {
    isAdmin?: boolean;
    verifiedID?: string;
    authorizationtoken?: string;
};

export const AuthVerificationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { headers }: { headers: Headers } = req;
        const { authorizationtoken } = headers;

        if (!authorizationtoken) {
            return res.json({ code: "ET" });
        }

        const verrifyToken = TokenVerifier(authorizationtoken);

        if (!verrifyToken) {
            return res.json({ code: "WT" });
        }

        const { id } = (verrifyToken as { id: string }) || {};

        const user = await UserModel.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ code: "E00" });
        }

        const { _id, admin } = user;

        headers.verifiedID = _id.toString();
        headers.isAdmin = admin;

        next();
    } catch (error: any) {
        console.log("🚀 ~ file: ServerFunctions.ts:20 ~ AuthVerification ~ error:", error);
        logger.error(error.message);
        return res.json({ code: "EU", error: error.message });
    }
};
export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = req;

        if (!body) {
            return next();
        }

        for (const key in body) {
            body[key] = escapeInput(body[key]);
        }

        req.body = body;
        next();
    } catch (error: any) {
        console.log("🚀 ~ file: ServerFunctions.ts:54 ~ sanitizeInputs ~ error:", error);
        logger.error(error.message);
    }
};

export const adminCheck = (req: Request, res: Response, next: NextFunction) => {
    const { headers } = req;
    const { isAdmin } = headers;
    try {
        if (!isAdmin) {
            return res.status(403).json({ code: "EF" });
        }

        next();
    } catch (error: any) {
        console.log("🚀 ~ file: ServerFunctions.ts:20 ~ AuthVerification ~ error:", error);
        logger.error(error.message);
        return res.json({ code: "EU", error: error.message });
    }
};

export const TokenVerifier = (token: string) => {
    try {
        if (token == undefined) {
            return false;
        }
        return jwt.verify(token, process.env.TOKEN_ENCRIPTION_KEY!);
    } catch (error: any) {
        logger.error(error.message);
        console.log("🚀 ~ file: middle.ts:25 ~ TokenVerifier ~ error:", error);
    }
};

export const generateToken = (id: string) => {
    try {
        if (!id) {
            return "id is Mendatory";
        }
        return jwt.sign({ id }, process.env.TOKEN_ENCRIPTION_KEY!);
    } catch (error: any) {
        logger.error(error.message);
        console.log("🚀 ~ file: middle.ts:36 ~ generateToken ~ error:", error);
    }
};

export const urlWitoutParams = (url: string) => {
    const urlArr = url.split("/");
    if (urlArr.length <= 4) {
        return urlArr.join("/");
    }
    urlArr.pop();

    return urlArr.join("/");
};

export const editModelWithSave = (model: any, edit: any) => {
    for (const key in edit) {
        model[key] = edit[key];
    }
    return model;
};
export const encryptString = (infos: string) => {
    try {
        return CryptoJS.AES.encrypt(infos, process.env.PASSWORD_ENCRIPTION_KEY!);
    } catch (error: any) {
        logger.error(error.message);
        console.log("🚀 ~ file: ServerFunctions.ts:127 ~ cryptBillingInfos ~ error:", error);
        return false;
    }
};

export const decryptString = (encryptedBilling: string) => {
    try {
        return CryptoJS.AES.decrypt(encryptedBilling, process.env.PASSWORD_ENCRIPTION_KEY!).toString(CryptoJS.enc.Utf8);
    } catch (error: any) {
        logger.error(error.message);
        console.log("🚀 ~ file: ServerFunctions.ts:134 ~ decryptBillingInfos ~ error:", error);
        return false;
    }
};

export const randomIdGenerator = (length: number) => {
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return id;
};
