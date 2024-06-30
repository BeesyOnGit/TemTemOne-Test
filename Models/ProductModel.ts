import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema<ProductType>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
        ref: "User",
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: (price: number) => {
                return price > 0;
            },
        },
    },
    createdAt: {
        type: Number,
        default: () => {
            return Date.now();
        },
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
    creator: string;
    createdAt?: number;
    editedAt?: number;
    _id?: string | mongoose.Schema.Types.ObjectId;
};
