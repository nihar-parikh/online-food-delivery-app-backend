import express from "express";
import {
  deliveryLogin,
  deliverySignUp,
  editDeliveryProfile,
  getDeliveryProfile,
  updateDeliveryUserStatus,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router = express.Router();

/* ------------------- Signup / Create Customer --------------------- */
router.post("/signup", deliverySignUp);

/* ------------------- Login --------------------- */
router.post("/login", deliveryLogin);

/* ------------------- Authentication --------------------- */
router.use(authenticateUser);

/* ------------------- Change Service Status --------------------- */
router.put("/change-status", updateDeliveryUserStatus);

/* ------------------- Profile --------------------- */
router.get("/profile", getDeliveryProfile);
router.patch("/profile", editDeliveryProfile);

export { router as DeliveryRoute };
