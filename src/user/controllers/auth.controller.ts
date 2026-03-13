import type { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../utils/asyncHandler.utils.js";
import { useErrorResponse, useSuccessResponse } from "../../utils/resp.utils.js";
import { message } from "../../utils/variables.utils.js";
import sendMail from "../../utils/sendMail.utils.js";
import User from "../models/User.Schema.js";


export const register = asyncHandler(async (req: any, res: Response) => {
  const { email, password } = req.body;

  const issuedAt = Math.floor(Date.now() / 1000);

  const expirationTime = issuedAt + 3600; // 1 hour expiration

  const payload = {
    email: email,
    iat: issuedAt,
    exp: expirationTime
  };

  const emailVerifyToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  const emailVerifyLink = process.env.FRONTEND_URL_ACCOUNT_VERIFY + emailVerifyToken;

  let findUser = await User.findOne({ email });

  // User Not Found : Create
  if (!findUser) {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log(`User Created ${email}`);

    useSuccessResponse(res, message.verifyEmail, { email: user.email }, 200);
    sendMail(email, "Email Verification", `<h1><a href="${emailVerifyLink}">Verify</a></h1>`);
    return;
  }

  // Deleted OR Not Verified
  if (findUser.isDeleted || !findUser.isVerified) {
    useSuccessResponse(res, message.verifyEmail, { email: findUser.email }, 200);
    // send mail
    sendMail(email, "Email Verification", `<h1><a href="${emailVerifyLink}">Verify</a></h1>`);
    return;
  }

  // Verified
  if (findUser.isVerified) {
    console.log(`User Already registered ${email}`);
    return useErrorResponse(res, message.existing, 409);
  }
});

export const login = asyncHandler(async (req: any, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    useErrorResponse(res, message.enterAllFeilds, 400);
  };

  const findUser = await User.findOne({ email });

  if (!findUser) {
    console.log(`User not found`)
    return useErrorResponse(res, message.invalidCredentials, 401);
  }

  const passwordMatch = await bcrypt.compare(password, findUser.password);

  if (!passwordMatch) {
    console.log(`Invalid pw`)
    return useErrorResponse(res, message.invalidCredentials, 401);
  }

  const token = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '30d' });

  useSuccessResponse(res, message.loginSuccess, { token }, 200);
});

export const verifyEmail = asyncHandler(async (req: any, res: Response) => {
  const { token } = req.body;

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

  const email = decoded.email;

  const findUser = await User.findOne({ email });

  if (!findUser) {
    return useErrorResponse(res, message.userNotFound, 404);
  }
  findUser.isVerified = true;
  await findUser.save();
  useSuccessResponse(res, message.otpVerified, {}, 200);
});