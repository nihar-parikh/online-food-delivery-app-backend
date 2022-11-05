import express, { Request, Response, NextFunction } from "express";
import {
  customerLogin,
  customerSignUp,
  customerVerify,
  editCustomerProfile,
  getCustomerProfile,
  requestNewOtp,
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
router.put("/verify", customerVerify);

/* ------------------- OTP / request OTP --------------------- */
router.get("/newOTP", requestNewOtp);

/* ------------------- Profile --------------------- */
router.get("/profile", getCustomerProfile);
router.put("/profile", editCustomerProfile);

export { router as CustomerRoute };
