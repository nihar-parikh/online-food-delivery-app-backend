import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import { CustomerCreateInput } from "../dto";
import { Customer } from "../models";
import { generateOTP, generatePassword, generateSalt } from "../utility";

export const customerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CustomerCreateInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, phone, password } = customerInputs;

  const salt = await generateSalt();
  const userPassword = await generatePassword(password, salt);

  const { otp, otp_expiry } = generateOTP();
  console.log(otp, otp_expiry);

  //   const existingCustomer = await Customer.find({ email: email });

  //   if (existingCustomer !== null) {
  //     return res.status(400).json({ message: "Email already exist!" });
  //   }

  //   const result = await Customer.create({
  //     email: email,
  //     password: userPassword,
  //     salt: salt,
  //     phone: phone,
  //     otp: otp,
  //     otp_expiry: otp_expiry,
  //     firstName: "",
  //     lastName: "",
  //     address: "",
  //     verified: false,
  //     lat: 0,
  //     lng: 0,
  //     orders: [],
  //   });
};

export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const editCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
