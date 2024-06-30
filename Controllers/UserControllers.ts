import { Response, Request } from "express";
import { decryptString, editModelWithSave, encryptString, generateToken } from "../Middleware/ServerFunctions";
import UserModel, { UserType } from "../Models/UserModel";

export const registerUser = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const { password } = (body as UserType) || {};

        if (!password) {
            return res.status(400).json({ code: "EM" });
        }

        const encryptedPassword = encryptString(password);

        if (!encryptedPassword) {
            return res.status(500).json({ code: "EC" });
        }

        const newUser = await UserModel.create({ ...body, password: encryptedPassword });

        if (!newUser) {
            return res.status(404).json({ code: "E00" });
        }
        const { _id } = newUser;

        return res.status(200).json({ code: "S00" });
    } catch (error: any) {
        console.log("🚀 ~ file: UserControllers.ts:21 ~ createUser ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};
export const loginUser = async (req: Request, res: Response) => {
    const { body } = req;
    const { email, password } = body as Partial<UserType>;
    try {
        const findUser = await UserModel.findOne({ email });

        if (!findUser) {
            return res.status(404).json({ code: "E00" });
        }
        const { password: encryptedPassword, _id } = findUser;

        const clearEncPassword = decryptString(encryptedPassword);

        if (!clearEncPassword) {
            return res.status(500).json({ code: "EC" });
        }

        if (clearEncPassword != password) {
            return res.status(403).json({ code: "EP" });
        }

        const token = generateToken(_id.toString());

        return res.status(200).json({ code: "S03", data: { token } });
    } catch (error: any) {
        console.log("🚀 ~ file: UserControllers.ts:21 ~ createUser ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};

export const editUser = async (req: Request, res: Response) => {
    const { body, params, path, headers } = req;
    const { id } = params;
    const filter = { _id: id };
    try {
        const findUser = await UserModel.findOne(filter);

        if (!findUser) {
            return res.status(404).json({ code: "E01" });
        }

        editModelWithSave(findUser, body);

        const editedUser = await findUser.save();

        if (!editedUser) {
            return res.status(500).json({ code: "E02" });
        }

        return res.status(200).json({ code: "S01" });
    } catch (error: any) {
        console.log("🚀 ~ file: UserControllers.ts:45 ~ editUser ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};
export const deleteUser = async (req: Request, res: Response) => {
    const { params, headers } = req;
    const { id } = params;
    const filter = { _id: id };

    try {
        const findUser = await UserModel.findOne(filter);

        if (!findUser) {
            return res.status(404).json({ code: "E01" });
        }

        const deletedUser = await findUser.delete();

        if (!deletedUser) {
            return res.status(500).json({ code: "E03" });
        }

        return res.status(200).json({ code: "S02" });
    } catch (error: any) {
        console.log("🚀 ~ file: UserControllers.ts:67 ~ deleteUser ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const Users = await UserModel.find();

        if (!Users || Users.length == 0) {
            return res.status(404).json({ code: "E01" });
        }

        return res.status(200).json({ code: "S03", data: { users: Users } });
    } catch (error: any) {
        console.log("🚀 ~ file: UserControllers.ts:88 ~ getUsers ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};
