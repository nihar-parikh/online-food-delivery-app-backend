import { validatePassword, generateToken } from "./../utility/PasswordUtility";
import { findVendor } from "./AdminController";
import { Request, Response, NextFunction } from "express";
import { VendorEditInput, VendorLoginInput } from "../dto";
import { Food, Vendor } from "../models";
import { FoodCreateInput } from "../dto/Food.dto";

export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingVendor = await findVendor("", email);

  if (!existingVendor) {
    return res.status(404).json({ message: "Invalid Credentials" });
  }

  const isCorrectPassword = await validatePassword(
    password,
    existingVendor.password,
    existingVendor.salt
  );

  if (!isCorrectPassword) {
    return res.status(404).json({ message: "Invalid Credentials" });
  }
  const token = await generateToken({
    _id: existingVendor._id,
    email: existingVendor.email,
    name: existingVendor.name,
  });

  return res.status(200).json(token);
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await findVendor(user._id);
    return res.json(existingVendor);
  }

  return res.json({ message: "Vendor Information Not Found" });
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { foodType, name, address, phone } = <VendorEditInput>req.body;

  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodType;
      const updatedVendor = await existingVendor.save();

      return res.json(updatedVendor);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vendor = await findVendor(user._id);

    if (vendor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);

      const saveResult = await vendor.save();

      return res.json(saveResult);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

      const updatedVendor = await existingVendor.save();

      return res.json(updatedVendor);
    }
  }
  return res.json({ message: "Unable to Update service availability " });
};

export const addFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { name, description, category, foodType, readyTime, price } = <
    FoodCreateInput
  >req.body;

  if (!user) {
    return res.status(404).json({ message: "Unable to add food" });
  }

  const vendor = await findVendor(user._id);
  if (!vendor) {
    return res.status(404).json({ message: "Unable to add food" });
  }

  const files = req.files as [Express.Multer.File];

  const images = files.map((file: Express.Multer.File) => file.filename);

  const food = await Food.create({
    vendorId: vendor._id,
    name: name,
    description: description,
    category: category,
    price: price,
    ratings: 0,
    readyTime: readyTime,
    foodType: foodType,
    images: images,
  });

  vendor.foods.push(food._id);
  const updatedVendor = await vendor.save();

  return res.json(updatedVendor);
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "foods not found" });
  }

  const foods = await Food.find({
    vendorId: user._id,
  });

  return res.status(200).json(foods);
};
