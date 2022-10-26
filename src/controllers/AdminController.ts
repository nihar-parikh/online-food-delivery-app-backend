import { generateSalt, generatePassword } from "./../utility/index";
import { VendorCreateInput } from "./../dto";
import { Request, Response, NextFunction } from "express";
import { Vendor } from "../models";

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
