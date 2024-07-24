import mongoose from "mongoose";

export const DbConnection = async (dbName: string, dbUrl: string) => {
    try {
        mongoose.set("strictQuery", false);
        const connection = await mongoose.connect(`${dbUrl}/${dbName}`);
        if (!connection) {
            return console.log("db connection unknown error");
        }
        console.log(`${dbName} database connected`);
    } catch (error) {
        console.error(error);
    }
};
