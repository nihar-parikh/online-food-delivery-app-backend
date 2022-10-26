import { createVendor, getAllVendors, getVendorById } from "./../controllers";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/vendor", createVendor);
router.get("/vendors", getAllVendors);
router.get("/vendor/:vendorId", getVendorById);

export { router as AdminRoute };
