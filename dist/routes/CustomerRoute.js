"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middleware_1 = require("../middleware");
var router = express_1.default.Router();
exports.CustomerRoute = router;
/* ------------------- Suignup / Create Customer --------------------- */
router.post("/signup", controllers_1.customerSignUp);
/* ------------------- Login --------------------- */
router.post("/login", controllers_1.customerLogin);
/* ------------------- Authentication --------------------- */
router.use(middleware_1.authenticateUser);
/* ------------------- Verify Customer Account --------------------- */
router.put("/verify", controllers_1.customerVerify);
/* ------------------- OTP / request OTP --------------------- */
router.get("/newOTP", controllers_1.requestNewOtp);
/* ------------------- Profile --------------------- */
router.get("/profile", controllers_1.getCustomerProfile);
router.put("/profile", controllers_1.editCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map