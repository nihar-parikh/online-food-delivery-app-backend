import {
  vendorLogin,
  getVendorProfile,
  updateVendorProfile,
  updateVendorService,
  addFood,
  getFoods,
  updateVendorCoverImage,
  getCurrentOrders,
  getOrderDetails,
  processOrder,
  addOffer,
  editOffer,
  deleteOffer,
  getOffers,
} from "./../controllers";
import express from "express";
import { authenticateUser } from "../middleware";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", vendorLogin);

//protected routes
router.use(authenticateUser); //instead of passing this function in every protected route
router.get("/profile", getVendorProfile);
router.put("/profile", updateVendorProfile);
router.put("/coverImage", images, updateVendorCoverImage);
router.put("/service", updateVendorService);

router.post("/food", images, addFood);
router.get("/foods", getFoods);

//orders
router.get("/orders", getCurrentOrders);
router.get("/order/:orderId", getOrderDetails);
router.put("/order/:orderId/process", processOrder);

//Offers
router.post("/offer", addOffer);
router.get("/offers", getOffers);
router.put("/offer/:offerId", editOffer);
router.delete("/offer/:offerId", deleteOffer);

export { router as VendorRoute };
