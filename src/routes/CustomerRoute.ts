import express, { Request, Response, NextFunction } from "express";
import {
  addToCart,
  applyForOffer,
  createOrder,
  createPayment,
  customerLogin,
  customerSignUp,
  customerVerify,
  deleteCart,
  editCustomerProfile,
  getCart,
  getCustomerProfile,
  getOrderById,
  getOrders,
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

/* ------------------- Cart --------------------- */
router.post("/cart", addToCart);
router.get("/cart", getCart);
router.delete("/cart", deleteCart);

/* ------------------- Order --------------------- */
router.post("/create-order", createOrder);
router.get("/orders", getOrders);
router.get("/order/:orderId", getOrderById);

//offers
router.get("/offer/apply/:offerId", applyForOffer);

//payment
router.post("/create-payment", createPayment);

export { router as CustomerRoute };
