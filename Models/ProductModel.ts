import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema<ProductType>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    creater: {
        type: String,
        required: true,
        ref: "User",
        trim: true,
        // this is a reference to the product creater
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: (price: number) => {
                return price > 0;
            },
        },
        trim: true,
    },
    createdAt: {
        type: Number,
        default: () => {
            return Date.now();
        },
        trim: true,
    },
    editedAt: {
        type: Number,
        default: () => {
            return Date.now();
        },
    },
});

ProductSchema.pre("save", function () {
    this.editedAt = new Date().getTime();
});

const ProductModel: mongoose.Model<ProductType> = mongoose.model<ProductType>("Product", ProductSchema);
export default ProductModel;

export type ProductType = {
    name: string;
    description: string;
    image: string;
    category: string;
    price: number;
    creater: string;
    deleted: boolean;
    createdAt?: number;
    editedAt?: number;
    _id?: string | mongoose.Schema.Types.ObjectId;
};
