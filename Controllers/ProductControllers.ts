import { Response, Request } from "express";
import { editModelWithSave } from "../Middleware/ServerFunctions";
import ProductModel, { ProductType } from "../Models/ProductModel";
import { escapeInput, logger } from "../Middleware/Utils";

export const createProduct = async (req: Request, res: Response) => {
    const { body, headers } = req;
    const { verifiedID } = headers;
    const { image } = body as ProductType;
    try {
        // If the image is not uploaded via the frontEnd to a CDN (send here as a base64 or Blob)
        // Implemet logic to do it here ...
        // Then replace the image value with the link to the uploaded image provided by the CDN

        // I would have don it but it's outside the scope of the test (not required in the test)

        // Please note that we dont validate the inputs (apart from escaping special characters using a middleware)
        // Because mongoose does the validation for us
        const newProduct = await ProductModel.create({ ...body, creator: verifiedID });

        if (!newProduct) {
            return res.status(404).json({ code: "E10" });
        }
        const { _id } = newProduct;

        return res.status(200).json({ code: "S10" });
    } catch (error: any) {
        console.log("🚀 ~ file: ProductControllers.ts:21 ~ createProduct ~ error:", error);
        logger.error(error.message);
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
        logger.error(error.message);
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

        // Here we edit the object (product we found) with the "editModelWithSave" function
        // For us to be able to use model.save() to save the modifications
        // All that in order for mongoose to be able to run the validation on values
        editModelWithSave(findProduct, { deleted: true });

        // Here we save them
        const deletedProduct = await findProduct.save();

        if (!deletedProduct) {
            return res.status(500).json({ code: "E13" });
        }

        return res.status(200).json({ code: "S12" });
    } catch (error: any) {
        console.log("🚀 ~ file: ProductControllers.ts:67 ~ deleteProduct ~ error:", error);
        logger.error(error.message);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    const { query } = req;
    // excaping the query
    if (query) {
        for (const key in query) {
            if (query[key]) {
                query[key] = escapeInput(query[key].toString());
            }
        }
    }

    const { category, order }: { category: string | undefined; order: "descending" | "ascending" | undefined } = (query as any) || {};
    try {
        // "hash map" to select category in order to not use conditions and gain a little bit of perfs
        const categoryFilter = {
            undefined: {},
            [category!]: category,
        };
        // "hash map" for price filter preference in order to not use conditions and gain a little bit of perfs
        const priceFilter: { [key in "ascending" | "descending" | "undefined"]: 1 | -1 } = {
            undefined: 1,
            descending: -1, // descending
            ascending: 1, // ascending
        };

        // creating the filter using the "hashmap" and the user choice
        const filter = { ...categoryFilter[category!] };

        // filtering and sorting using mongoose
        const Products = await ProductModel.find(filter).sort({ price: priceFilter[order!] });

        if (!Products || Products.length == 0) {
            return res.status(404).json({ code: "E11" });
        }

        return res.status(200).json({ code: "S13", data: { Products } });
    } catch (error: any) {
        console.log("🚀 ~ file: ProductControllers.ts:88 ~ getProducts ~ error:", error);
        logger.error(error.message);
        return res.status(400).json({ code: "EU", error: error.message });
    }
};
