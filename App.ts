import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import { DbConnection } from "./DBConnection";
//imports for your modules (auto generated)
import UserRoutes from "./Routes/UserRoutes";
import ProductRoutes from "./Routes/ProductRoutes";
import mongoose from "mongoose";

dotenv.config();

//Constatnts definition
const app: any = express();
const PORT = process.env.PORT;
http.createServer(app);

//Variable deffinition

//Db connection//

DbConnection("temtem_test", "mongodb://127.0.0.1:27017");

//Midelware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(
    compression({
        level: 6,
    })
);

// Define a middleware to handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not found");
    res.status(404).json({
        message: error.message,
    });
});

// Define a middleware to handle all other errors
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    // If the error is a MongoDB error, return a 500 error with a custom message
    if (error instanceof mongoose.Error) {
        res.status(500).json({
            message: "Database error",
        });
    } else {
        // Otherwise, return a 500 error with the error message
        res.status(500).json({
            message: error.message,
        });
    }
});

//App upload limite setting
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Define the authorized origins to communicate with
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

//************************************ # API ROUTES (DO NOT DELETE) # ****************************************//
//routing for your modules (auto generated)
app.use("/user", UserRoutes);
app.use("/product", ProductRoutes);
//************************************ # SERVER PORT SET # ****************************************//

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});
