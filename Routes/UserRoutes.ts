import express from "express";
import { registerUser, deleteUser, editUser, getUsers, loginUser } from "../Controllers/UserControllers";
import { AuthVerificationMiddleware, adminCheck, sanitizeInputs } from "../Middleware/ServerFunctions";
const UserRoutes = express.Router();

// AuthVerificationMiddleware act as an athentification layer (middleware) to protect our route from unlogged (no valide token) users
// adminCheck act as a protection layer to prevent non admin (owner) users from accessing the route

UserRoutes.post("/register", sanitizeInputs, registerUser);
UserRoutes.post("/login", sanitizeInputs, loginUser);
UserRoutes.post("/edit/:id", AuthVerificationMiddleware, adminCheck, sanitizeInputs, editUser);
UserRoutes.delete("/:id", AuthVerificationMiddleware, adminCheck, deleteUser);
UserRoutes.get("/", AuthVerificationMiddleware, adminCheck, getUsers);

export default UserRoutes;
