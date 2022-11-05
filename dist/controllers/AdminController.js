"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorById = exports.getAllVendors = exports.createVendor = exports.findVendor = void 0;
var index_1 = require("./../utility/index");
var models_1 = require("../models");
//generic function for finding vendor either by id or email(optional)
var findVendor = function (vendorId, email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!email) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Vendor.findOne({ email: email })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, models_1.Vendor.findById(vendorId)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findVendor = findVendor;
var createVendor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, ownerName, foodType, pincode, address, phone, email, password, existingVendor, salt, hashedPassword, newVendor;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, ownerName = _a.ownerName, foodType = _a.foodType, pincode = _a.pincode, address = _a.address, phone = _a.phone, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, exports.findVendor)("", email)];
            case 1:
                existingVendor = _b.sent();
                if (existingVendor) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Vendor with ".concat(email, " mail-id already exist"),
                        })];
                }
                return [4 /*yield*/, (0, index_1.generateSalt)()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, (0, index_1.generatePassword)(password, salt)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, models_1.Vendor.create({
                        name: name,
                        ownerName: ownerName,
                        foodType: foodType,
                        pincode: pincode,
                        address: address,
                        phone: phone,
                        email: email,
                        password: hashedPassword,
                        salt: salt,
                        serviceAvailable: false,
                        coverImages: [],
                        ratings: 0,
                    })];
            case 4:
                newVendor = _b.sent();
                return [2 /*return*/, res.status(201).json(newVendor)];
        }
    });
}); };
exports.createVendor = createVendor;
var getAllVendors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.Vendor.find()];
            case 1:
                vendors = _a.sent();
                if (vendors.length === 0) {
                    return [2 /*return*/, res.json({ message: "No vendors are available" })];
                }
                return [2 /*return*/, res.json(vendors)];
        }
    });
}); };
exports.getAllVendors = getAllVendors;
var getVendorById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendorId, vendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendorId = req.params.vendorId;
                return [4 /*yield*/, (0, exports.findVendor)(vendorId)];
            case 1:
                vendor = _a.sent();
                if (!vendor) {
                    return [2 /*return*/, res.json({ message: "Vendor not available" })];
                }
                return [2 /*return*/, res.json(vendor)];
        }
    });
}); };
exports.getVendorById = getVendorById;
//# sourceMappingURL=AdminController.js.map