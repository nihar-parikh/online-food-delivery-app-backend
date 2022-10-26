import express, { Request, Response, NextFunction } from "express";
import {
  customerLogin,
  customerSignUp,
  customerVerify,
  editCustomerProfile,
  getCustomerProfile,
  requestOtp,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router = express.Router();

/* ------------------- Suignup / Create Customer --------------------- */
router.post("/signup", customerSignUp);

/* ------------------- Login --------------------- */
router.post("/login", customerLogin);

/* ------------------- Authentication --------------------- */
router.use(authenticateUser);

/* ------------------- Verify Customer Account --------------------- */
router.patch("/verify", customerVerify);

/* ------------------- OTP / request OTP --------------------- */
router.get("/otp", requestOtp);

/* ------------------- Profile --------------------- */
router.get("/profile", getCustomerProfile);
router.patch("/profile", editCustomerProfile);

export { router as CustomerRoute };
