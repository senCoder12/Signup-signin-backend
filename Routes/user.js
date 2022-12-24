import express from "express";
import { signup, signin, getUserByJWT, getAllUser } from "../Controllers/userContollers.js";

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/getUserByJwt', getUserByJWT);
userRouter.get('/', getAllUser);

export default userRouter;