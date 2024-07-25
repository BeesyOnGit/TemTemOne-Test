import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import { DbConnection } from "./DBConnection";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import UserRoutes from "./Routes/UserRoutes";
import ProductRoutes from "./Routes/ProductRoutes";
import { logger } from "./Middleware/Utils";

dotenv.config();

//Constants definition
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

//App upload limite setting
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

//Define the authorized origins to communicate with
app.use(cors({ origin: "*" })); // The * is for dev purposes only change origin later if needed
app.use(helmet()); //Adds various security HTTP Headers
app.use(morgan("combined", { stream: { write: (message: string) => logger.info(message.trim()) } })); // HTTP request logger

// Configure the rate limiter (normally i do this part using NGINX but fot the test purpose i do it here)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    headers: true, // Include rate limit info in the `RateLimit-*` headers
});

// Apply the rate limiter to all requests
app.use(limiter);

//************************************ # API ROUTES (DO NOT DELETE) # ****************************************//

//Routing for your modules
app.use("/user", UserRoutes);
app.use("/product", ProductRoutes);

// Define a middleware to handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Requested Page Not Found");
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
//************************************ # SERVER PORT SET # ****************************************//

app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});
