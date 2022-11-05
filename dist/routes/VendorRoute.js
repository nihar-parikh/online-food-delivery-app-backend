"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
var controllers_1 = require("./../controllers");
var express_1 = __importDefault(require("express"));
var middleware_1 = require("../middleware");
var multer_1 = __importDefault(require("multer"));
var router = express_1.default.Router();
exports.VendorRoute = router;
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
var images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", controllers_1.vendorLogin);
//protected routes
router.use(middleware_1.authenticateUser); //instead of passing this function in every protected route
router.get("/profile", controllers_1.getVendorProfile);
router.put("/profile", controllers_1.updateVendorProfile);
router.put("/coverImage", images, controllers_1.updateVendorCoverImage);
router.put("/service", controllers_1.updateVendorService);
router.post("/food", images, controllers_1.addFood);
router.get("/foods", controllers_1.getFoods);
//# sourceMappingURL=VendorRoute.js.map