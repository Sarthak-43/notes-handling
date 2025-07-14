import express from "express";
import { login, logout, signUp } from "../controllers/auth.controllers.js";

let authRouter = express.Router();
authRouter.post("/signup",signUp);
authRouter.post("/signin",login);
authRouter.get("/signout",logout)
export default authRouter;