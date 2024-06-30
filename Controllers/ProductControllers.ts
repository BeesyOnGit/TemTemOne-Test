import { Response, Request } from "express";
import { editModelWithSave } from "../Middleware/ServerFunctions";
import ProductModel, { ProductType } from "../Models/ProductModel";

export const createProduct = async (req: Request, res: Response) => {
    const { body, headers } = req;
    const { verifiedID } = headers;
    try {
        const newProduct = await ProductModel.create({ ...body, creator: verifiedID });

        if (!newProduct) {
            return res.status(404).json({ code: "E10" });
        }
        const { _id } = newProduct;

        return res.status(200).json({ code: "S10" });
    } catch (error: any) {
        console.log("🚀 ~ file: ProductControllers.ts:21 ~ createProduct ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};

export const editProduct = async (req: Request, res: Response) => {
    const { body, params, headers } = req;
    const { id } = params;

    const filter = { _id: id };
    try {
        const findProduct = await ProductModel.findOne(filter);

        if (!findProduct) {
            return res.status(404).json({ code: "E11" });
        }

        editModelWithSave(findProduct, body);

        const editedProduct = await findProduct.save();

        if (!editedProduct) {
            return res.status(500).json({ code: "E12" });
        }

        return res.status(200).json({ code: "S11" });
    } catch (error: any) {
        console.log("🚀 ~ file: ProductControllers.ts:45 ~ editProduct ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};
export const deleteProduct = async (req: Request, res: Response) => {
    const { params, headers } = req;
    const { id } = params;
    const filter = { _id: id };

    try {
        const findProduct = await ProductModel.findOne(filter);

        if (!findProduct) {
            return res.status(404).json({ code: "E11" });
        }

        const deletedProduct = await findProduct.delete();

        if (!deletedProduct) {
            return res.status(500).json({ code: "E13" });
        }

        return res.status(200).json({ code: "S12" });
    } catch (error: any) {
        console.log("🚀 ~ file: ProductControllers.ts:67 ~ deleteProduct ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    const { query } = req;
    const { category, price }: Partial<ProductType> = (query as any) || {};
    try {
        const categoryFilter = {
            undefined: {},
            [category!]: category,
        };
        const priceFilter = {
            undefined: 1,
            "-1": -1, // descending
            "1": 1, // ascending
        };

        const filter = { ...categoryFilter[category!] };

        const Products = await ProductModel.find(filter).sort({ price: priceFilter[price!] });

        if (!Products || Products.length == 0) {
            return res.status(404).json({ code: "E11" });
        }

        return res.status(200).json({ code: "S13", data: { Products } });
    } catch (error: any) {
        console.log("🚀 ~ file: ProductControllers.ts:88 ~ getProducts ~ error:", error);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};
