import { generateSalt, generatePassword } from "./../utility/index";
import { VendorCreateInput } from "./../dto";
import { Request, Response, NextFunction } from "express";
import { DeliveryUser, Transaction, Vendor } from "../models";

//generic function for finding vendor either by id or email(optional)
export const findVendor = async (
  vendorId: String | undefined,
  email?: string
) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(vendorId);
  }
};

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    pincode,
    address,
    phone,
    email,
    password,
  } = <VendorCreateInput>req.body;

  const existingVendor = await findVendor("", email);

  if (existingVendor) {
    return res.status(400).json({
      message: `Vendor with ${email} mail-id already exist`,
    });
  }

  //generate salt
  const salt = await generateSalt();
  //generate hashed password
  const hashedPassword = await generatePassword(password, salt);

  const newVendor = await Vendor.create({
    name,
    ownerName,
    foodType,
    pincode,
    address,
    phone,
    email,
    password: hashedPassword,
    salt: salt,
    serviceAvailable: false,
    coverImages: [],
    ratings: 0,
    lat: 0, //admin won't provide any location for vendor ->it should be updated by vendor only while updating availabilty service
    lng: 0, //admin won't provide any location for vendor ->it should be updated by vendor only while updating availabilty service
  });

  return res.status(201).json(newVendor);
};

export const getAllVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors.length === 0) {
    return res.json({ message: "No vendors are available" });
  }
  return res.json(vendors);
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.vendorId;

  const vendor = await findVendor(vendorId); //email is optional so need to pass

  if (!vendor) {
    return res.json({ message: "Vendor not available" });
  }
  return res.json(vendor);
};

export const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allTransactions = await Transaction.find();

  if (allTransactions) {
    return res.status(200).json(allTransactions);
  }

  return res.json({ message: "Transactions data not available" });
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactionId = req.params.transactionId;
  const transaction = await Transaction.findById(transactionId);

  if (transaction) {
    return res.status(200).json(transaction);
  }

  return res.json({ message: "Transaction data not available" });
};

export const verifyDeliveryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { deliveryUserId, verified } = req.body;
  if (deliveryUserId) {
    const deliveryUser = await DeliveryUser.findById(deliveryUserId);

    if (deliveryUser) {
      deliveryUser.verified = verified;

      await deliveryUser.save();
      return res.status(200).json(deliveryUser);
    }
  }
  return res.json({ message: "Unable to verify Delivery User" });
};

export const getDeliveryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUsers = await DeliveryUser.find();

  if (deliveryUsers) {
    return res.status(200).json(deliveryUsers);
  }

  return res.json({ message: "Unable to get Delivery Users" });
};
