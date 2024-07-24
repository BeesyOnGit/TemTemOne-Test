import mongoose from "mongoose";
const UserSchema = new mongoose.Schema<UserType>({
    firstName: {
        type: String,
        validate: {
            validator: (name: string) => {
                return name.length > 5;
            },
            message: "name must be more than 5 characters",
        },
        trim: true,
    },
    lastName: {
        type: String,
        validate: {
            validator: (name: string) => {
                return name.length > 5;
            },
            message: "name must be more than 5 characters",
        },
        trim: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (mail: string) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                return new RegExp(emailRegex).test(mail);
            },
            message: "enter a valide email",
        },
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
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

UserSchema.pre("save", function () {
    this.editedAt = new Date().getTime();
});

const UserModel: mongoose.Model<UserType> = mongoose.model<UserType>("User", UserSchema);
export default UserModel;

export type UserType = {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    admin: boolean;
    createdAt: number;
    editedAt: number;
    _id?: string | mongoose.Schema.Types.ObjectId;
};
