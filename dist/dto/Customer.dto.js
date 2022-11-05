"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerEditProfileInput = exports.CustomerLoginInput = exports.CustomerVerifyInput = exports.CustomerCreateInput = void 0;
var class_validator_1 = require("class-validator");
//make these changes in tsconfig file while using class-validator
// "experimentalDecorators": true /* Enable experimental support for TC39 stage 2 draft decorators. */,
// "strictPropertyInitialization": false /* Check for class properties that are declared but not set in the constructor. */,
var CustomerCreateInput = /** @class */ (function () {
    function CustomerCreateInput() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)(),
        __metadata("design:type", String)
    ], CustomerCreateInput.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.Length)(7, 12),
        __metadata("design:type", String)
    ], CustomerCreateInput.prototype, "phone", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 12),
        __metadata("design:type", String)
    ], CustomerCreateInput.prototype, "password", void 0);
    return CustomerCreateInput;
}());
exports.CustomerCreateInput = CustomerCreateInput;
var CustomerVerifyInput = /** @class */ (function () {
    function CustomerVerifyInput() {
    }
    return CustomerVerifyInput;
}());
exports.CustomerVerifyInput = CustomerVerifyInput;
var CustomerLoginInput = /** @class */ (function () {
    function CustomerLoginInput() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)(),
        __metadata("design:type", String)
    ], CustomerLoginInput.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 12),
        __metadata("design:type", String)
    ], CustomerLoginInput.prototype, "password", void 0);
    return CustomerLoginInput;
}());
exports.CustomerLoginInput = CustomerLoginInput;
var CustomerEditProfileInput = /** @class */ (function () {
    function CustomerEditProfileInput() {
    }
    __decorate([
        (0, class_validator_1.Length)(3, 16),
        __metadata("design:type", String)
    ], CustomerEditProfileInput.prototype, "firstName", void 0);
    __decorate([
        (0, class_validator_1.Length)(3, 16),
        __metadata("design:type", String)
    ], CustomerEditProfileInput.prototype, "lastName", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 16),
        __metadata("design:type", String)
    ], CustomerEditProfileInput.prototype, "address", void 0);
    return CustomerEditProfileInput;
}());
exports.CustomerEditProfileInput = CustomerEditProfileInput;
//# sourceMappingURL=Customer.dto.js.map