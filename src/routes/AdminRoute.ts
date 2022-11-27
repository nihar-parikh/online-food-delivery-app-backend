import {
  createVendor,
  getAllTransactions,
  getAllVendors,
  getDeliveryUsers,
  getTransactionById,
  getVendorById,
  verifyDeliveryUser,
} from "./../controllers";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/vendor", createVendor);
router.get("/vendors", getAllVendors);
router.get("/vendor/:vendorId", getVendorById);

router.get("/transactions/", getAllTransactions);
router.get("/transaction/:transactionId", getTransactionById);

router.put("/delivery/verify", verifyDeliveryUser);
router.get("/delivery/users", getDeliveryUsers);

export { router as AdminRoute };
