import express from "express";
import { registerUser, deleteUser, editUser, getUsers, loginUser } from "../Controllers/UserControllers";
import { AuthVerificationMiddleware, adminCheck } from "../Middleware/ServerFunctions";
const UserRoutes = express.Router();

// AuthVerificationMiddleware act as an athentification layer (middleware) to protect our route from unlogged (no valide token) users
// adminCheck act as a protection layer to prevent non admin (owner) users from accessing the route

UserRoutes.post("/register", registerUser);
UserRoutes.post("/login", loginUser);
UserRoutes.post("/edit/:id", AuthVerificationMiddleware, adminCheck, editUser);
UserRoutes.delete("/:id", AuthVerificationMiddleware, adminCheck, deleteUser);
UserRoutes.get("/", AuthVerificationMiddleware, adminCheck, getUsers);

export default UserRoutes;
