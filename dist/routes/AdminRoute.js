"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
var controllers_1 = require("./../controllers");
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
exports.AdminRoute = router;
router.post("/vendor", controllers_1.createVendor);
router.get("/vendors", controllers_1.getAllVendors);
router.get("/vendor/:vendorId", controllers_1.getVendorById);
//# sourceMappingURL=AdminRoute.js.map