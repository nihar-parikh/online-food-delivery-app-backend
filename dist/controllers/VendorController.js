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
exports.getFoods = exports.addFood = exports.updateVendorService = exports.updateVendorCoverImage = exports.updateVendorProfile = exports.getVendorProfile = exports.vendorLogin = void 0;
var PasswordUtility_1 = require("./../utility/PasswordUtility");
var AdminController_1 = require("./AdminController");
var models_1 = require("../models");
var vendorLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingVendor, isCorrectPassword, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, AdminController_1.findVendor)("", email)];
            case 1:
                existingVendor = _b.sent();
                if (!existingVendor) {
                    return [2 /*return*/, res.status(404).json({ message: "Invalid Credentials" })];
                }
                return [4 /*yield*/, (0, PasswordUtility_1.validatePassword)(password, existingVendor.password, existingVendor.salt)];
            case 2:
                isCorrectPassword = _b.sent();
                if (!isCorrectPassword) {
                    return [2 /*return*/, res.status(404).json({ message: "Invalid Credentials" })];
                }
                return [4 /*yield*/, (0, PasswordUtility_1.generateToken)({
                        _id: existingVendor._id,
                        email: existingVendor.email,
                        name: existingVendor.name,
                    })];
            case 3:
                token = _b.sent();
                return [2 /*return*/, res.status(200).json(token)];
        }
    });
}); };
exports.vendorLogin = vendorLogin;
var getVendorProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, AdminController_1.findVendor)(user._id)];
            case 1:
                existingVendor = _a.sent();
                return [2 /*return*/, res.json(existingVendor)];
            case 2: return [2 /*return*/, res.json({ message: "Vendor Information Not Found" })];
        }
    });
}); };
exports.getVendorProfile = getVendorProfile;
var updateVendorProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, foodType, name, address, phone, existingVendor, updatedVendor;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, foodType = _a.foodType, name = _a.name, address = _a.address, phone = _a.phone;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, AdminController_1.findVendor)(user._id)];
            case 1:
                existingVendor = _b.sent();
                if (!existingVendor) return [3 /*break*/, 3];
                existingVendor.name = name;
                existingVendor.address = address;
                existingVendor.phone = phone;
                existingVendor.foodType = foodType;
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                updatedVendor = _b.sent();
                return [2 /*return*/, res.json(updatedVendor)];
            case 3: return [2 /*return*/, res.json({ message: "Unable to Update vendor profile " })];
        }
    });
}); };
exports.updateVendorProfile = updateVendorProfile;
var updateVendorCoverImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, vendor, files, images, saveResult;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, AdminController_1.findVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!vendor) return [3 /*break*/, 3];
                files = req.files;
                images = files.map(function (file) { return file.filename; });
                (_a = vendor.coverImages).push.apply(_a, images);
                return [4 /*yield*/, vendor.save()];
            case 2:
                saveResult = _b.sent();
                return [2 /*return*/, res.json(saveResult)];
            case 3: return [2 /*return*/, res.json({ message: "Unable to Update vendor profile " })];
        }
    });
}); };
exports.updateVendorCoverImage = updateVendorCoverImage;
var updateVendorService = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor, updatedVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, AdminController_1.findVendor)(user._id)];
            case 1:
                existingVendor = _a.sent();
                if (!existingVendor) return [3 /*break*/, 3];
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                updatedVendor = _a.sent();
                return [2 /*return*/, res.json(updatedVendor)];
            case 3: return [2 /*return*/, res.json({ message: "Unable to Update service availability " })];
        }
    });
}); };
exports.updateVendorService = updateVendorService;
var addFood = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, name, description, category, foodType, readyTime, price, vendor, files, images, food, updatedVendor;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, name = _a.name, description = _a.description, category = _a.category, foodType = _a.foodType, readyTime = _a.readyTime, price = _a.price;
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "Unable to add food" })];
                }
                return [4 /*yield*/, (0, AdminController_1.findVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!vendor) {
                    return [2 /*return*/, res.status(404).json({ message: "Unable to add food" })];
                }
                files = req.files;
                images = files.map(function (file) { return file.filename; });
                return [4 /*yield*/, models_1.Food.create({
                        vendorId: vendor._id,
                        name: name,
                        description: description,
                        category: category,
                        price: price,
                        ratings: 0,
                        readyTime: readyTime,
                        foodType: foodType,
                        images: images,
                    })];
            case 2:
                food = _b.sent();
                vendor.foods.push(food._id);
                return [4 /*yield*/, vendor.save()];
            case 3:
                updatedVendor = _b.sent();
                return [2 /*return*/, res.json(updatedVendor)];
        }
    });
}); };
exports.addFood = addFood;
var getFoods = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, foods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "foods not found" })];
                }
                return [4 /*yield*/, models_1.Food.find({
                        vendorId: user._id,
                    })];
            case 1:
                foods = _a.sent();
                return [2 /*return*/, res.status(200).json(foods)];
        }
    });
}); };
exports.getFoods = getFoods;
//# sourceMappingURL=VendorController.js.map