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
exports.requestNewOtp = exports.editCustomerProfile = exports.getCustomerProfile = exports.customerVerify = exports.customerLogin = exports.customerSignUp = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var dto_1 = require("../dto");
var models_1 = require("../models");
var utility_1 = require("../utility");
var customerSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, phone, password, existingCustomer, salt, userPassword, _a, otp, otp_expiry, result, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomerCreateInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _b.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                email = customerInputs.email, phone = customerInputs.phone, password = customerInputs.password;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 2:
                existingCustomer = _b.sent();
                if (existingCustomer) {
                    return [2 /*return*/, res.status(400).json({ message: "Email already exist!" })];
                }
                return [4 /*yield*/, (0, utility_1.generateSalt)()];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, (0, utility_1.generatePassword)(password, salt)];
            case 4:
                userPassword = _b.sent();
                _a = (0, utility_1.generateOTP)(), otp = _a.otp, otp_expiry = _a.otp_expiry;
                return [4 /*yield*/, models_1.Customer.create({
                        email: email,
                        password: userPassword,
                        salt: salt,
                        phone: phone,
                        otp: otp,
                        otp_expiry: otp_expiry,
                        firstName: "",
                        lastName: "",
                        address: "",
                        verified: false,
                        lat: 0,
                        lng: 0,
                        orders: [],
                    })];
            case 5:
                result = _b.sent();
                if (!result) return [3 /*break*/, 8];
                // send OTP to customer
                return [4 /*yield*/, (0, utility_1.onRequestOTP)(otp, phone)];
            case 6:
                // send OTP to customer
                _b.sent();
                return [4 /*yield*/, (0, utility_1.generateToken)({
                        _id: result._id,
                        email: result.email,
                        verified: result.verified,
                    })];
            case 7:
                token = _b.sent();
                // Send the result
                return [2 /*return*/, res
                        .status(201)
                        .json({ token: token, verified: result.verified, email: result.email })];
            case 8: return [2 /*return*/, res.status(400).json({ msg: "Error while creating user" })];
        }
    });
}); };
exports.customerSignUp = customerSignUp;
var customerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, password, customer, isValidPassword, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomerLoginInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                email = customerInputs.email, password = customerInputs.password;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 2:
                customer = _a.sent();
                if (!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, utility_1.validatePassword)(password, customer.password, customer.salt)];
            case 3:
                isValidPassword = _a.sent();
                if (!isValidPassword) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, utility_1.generateToken)({
                        _id: customer._id,
                        email: customer.email,
                        verified: customer.verified,
                    })];
            case 4:
                token = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        token: token,
                        email: customer.email,
                        verified: customer.verified,
                    })];
            case 5: return [2 /*return*/, res.json({ msg: "Error With Login" })];
        }
    });
}); };
exports.customerLogin = customerLogin;
var customerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerVerifyInput, validationError, otp, customer, customerProfile, verifedCustomerProfile, newToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerVerifyInput = (0, class_transformer_1.plainToClass)(dto_1.CustomerVerifyInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerVerifyInput, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                otp = customerVerifyInput.otp;
                customer = req.user;
                if (!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 2:
                customerProfile = _a.sent();
                if (!customerProfile) return [3 /*break*/, 5];
                if (!(customerProfile.otp === otp &&
                    customerProfile.otp_expiry >= new Date())) return [3 /*break*/, 5];
                customerProfile.verified = true;
                return [4 /*yield*/, customerProfile.save()];
            case 3:
                verifedCustomerProfile = _a.sent();
                return [4 /*yield*/, (0, utility_1.generateToken)({
                        _id: verifedCustomerProfile._id,
                        email: verifedCustomerProfile.email,
                        verified: verifedCustomerProfile.verified,
                    })];
            case 4:
                newToken = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        newToken: newToken,
                        email: verifedCustomerProfile.email,
                        verified: verifedCustomerProfile.verified,
                    })];
            case 5: return [2 /*return*/, res.status(400).json({ msg: "Unable to verify Customer" })];
        }
    });
}); };
exports.customerVerify = customerVerify;
var getCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(201).json(profile)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ msg: "Error while Fetching Profile" })];
        }
    });
}); };
exports.getCustomerProfile = getCustomerProfile;
var editCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, customerInputs, validationError, firstName, lastName, address, profile, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomerEditProfileInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                firstName = customerInputs.firstName, lastName = customerInputs.lastName, address = customerInputs.address;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 2:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, res.status(201).json(result)];
            case 4: return [2 /*return*/, res.status(400).json({ msg: "Error while Updating Profile" })];
        }
    });
}); };
exports.editCustomerProfile = editCustomerProfile;
var requestNewOtp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, customerProfile, _a, otp, otp_expiry;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                customerProfile = _b.sent();
                if (!customerProfile) return [3 /*break*/, 4];
                _a = (0, utility_1.generateOTP)(), otp = _a.otp, otp_expiry = _a.otp_expiry;
                customerProfile.otp = otp;
                customerProfile.otp_expiry = otp_expiry;
                return [4 /*yield*/, customerProfile.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, utility_1.onRequestOTP)(otp, customerProfile.phone)];
            case 3:
                _b.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "New OTP sent to your registered Mobile Number!" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.requestNewOtp = requestNewOtp;
//# sourceMappingURL=CustomerController.js.map