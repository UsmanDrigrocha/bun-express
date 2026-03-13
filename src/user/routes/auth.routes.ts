import express from "express";
import { login, register, verifyEmail } from "../controllers/auth.controller.js";

const route: any = express.Router();

route.post('/login', login);

route.post('/register', register);

route.post('/verify-email', verifyEmail);

export default route;