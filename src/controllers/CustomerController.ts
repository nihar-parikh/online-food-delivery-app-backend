import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import {
  CustomerCreateInput,
  CustomerEditProfileInput,
  CustomerLoginInput,
  CustomerVerifyInput,
} from "../dto";
import { Customer } from "../models";
import {
  generateOTP,
  generatePassword,
  generateSalt,
  generateToken,
  onRequestOTP,
  validatePassword,
} from "../utility";

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

  const existingCustomer = await Customer.findOne({ email: email });

  if (existingCustomer) {
    return res.status(400).json({ message: "Email already exist!" });
  }

  const salt = await generateSalt();
  const userPassword = await generatePassword(password, salt);

  const { otp, otp_expiry } = generateOTP();

  const result = await Customer.create({
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
  });

  if (result) {
    // send OTP to customer
    await onRequestOTP(otp, phone);

    //Generate the Signature
    const token = await generateToken({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    // Send the result
    return res
      .status(201)
      .json({ token, verified: result.verified, email: result.email });
  }

  return res.status(400).json({ msg: "Error while creating user" });
};

export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CustomerLoginInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, password } = customerInputs;
  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const isValidPassword = await validatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (isValidPassword) {
      const token = await generateToken({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(200).json({
        token,
        email: customer.email,
        verified: customer.verified,
      });
    }
  }

  return res.json({ msg: "Error With Login" });
};

export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerVerifyInput = plainToClass(CustomerVerifyInput, req.body);

  const validationError = await validate(customerVerifyInput, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { otp } = customerVerifyInput;
  const customer = req.user;

  if (customer) {
    const customerProfile = await Customer.findById(customer._id);

    if (customerProfile) {
      if (
        customerProfile.otp === otp &&
        customerProfile.otp_expiry >= new Date()
      ) {
        customerProfile.verified = true;
        const verifedCustomerProfile = await customerProfile.save();

        const newToken = await generateToken({
          _id: verifedCustomerProfile._id,
          email: verifedCustomerProfile.email,
          verified: verifedCustomerProfile.verified,
        });

        return res.status(200).json({
          newToken,
          email: verifedCustomerProfile.email,
          verified: verifedCustomerProfile.verified,
        });
      }
    }
  }
  return res.status(400).json({ msg: "Unable to verify Customer" });
};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(201).json(profile);
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Profile" });
};

export const editCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const customerInputs = plainToClass(CustomerEditProfileInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { firstName, lastName, address } = customerInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();

      return res.status(201).json(result);
    }
  }
  return res.status(400).json({ msg: "Error while Updating Profile" });
};

export const requestNewOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const customerProfile = await Customer.findById(customer._id);

    if (customerProfile) {
      const { otp, otp_expiry } = generateOTP();
      customerProfile.otp = otp;
      customerProfile.otp_expiry = otp_expiry;

      await customerProfile.save();
      await onRequestOTP(otp, customerProfile.phone);

      return res
        .status(200)
        .json({ message: "New OTP sent to your registered Mobile Number!" });
    }
  }
};
