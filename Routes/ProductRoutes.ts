import express from "express";
import { createProduct, deleteProduct, editProduct, getProducts } from "../Controllers/ProductControllers";
import { AuthVerificationMiddleware, adminCheck } from "../Middleware/ServerFunctions";
const ProductRoutes = express.Router();

// AuthVerificationMiddleware act as an athentification layer (middleware) to protect our route from unlogged (no valide token) users
// adminCheck act as a protection layer to prevent non admin (owner) users from accessing the route

ProductRoutes.post("/", AuthVerificationMiddleware, adminCheck, createProduct);
ProductRoutes.post("/edit/:id", AuthVerificationMiddleware, adminCheck, editProduct);
ProductRoutes.delete("/:id", AuthVerificationMiddleware, adminCheck, deleteProduct);
ProductRoutes.get("/", getProducts);

export default ProductRoutes;
