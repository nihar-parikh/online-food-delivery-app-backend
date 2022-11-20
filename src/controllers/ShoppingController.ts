import express, { Request, Response, NextFunction } from "express";
import { FoodDoc, Vendor } from "../models";
import { Offer } from "../models/OfferModel";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const availableFoods = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort({ ratings: -1 })
    .populate("foods");

  if (availableFoods.length === 0) {
    return res.status(400).json({ message: "No foods available" });
  }
  return res.status(200).json(availableFoods);
};

export const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const topRestaurants = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort({ ratings: -1 })
    .limit(2);

  if (topRestaurants.length === 0) {
    return res.status(400).json({ message: "No restaurants available" });
  }
  return res.status(200).json(topRestaurants);
};

export const getFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const vendors = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (vendors.length > 0) {
    let foodResult: any = [];
    vendors.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodResult);
  }
  return res.status(404).json({ message: "No food found!" });
};

export const searchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const vendors = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (vendors.length > 0) {
    let foodResult: any = [];
    vendors.map((vendor) => foodResult.push(...vendor.foods));
    return res.status(200).json(foodResult);
  }
  return res.status(404).json({ message: "No food found!" });
};

export const restaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const restaurantId = req.params.restaurantId;

  const restaurant = await Vendor.findById(restaurantId).populate("foods");

  if (!restaurant) {
    return res.status(400).json({ message: "No restaurant found" });
  }
  return res.status(200).json(restaurant);
};

export const getAvailableOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pinCode = req.params.pincode;

    const offers = await Offer.find({ pinCode: pinCode, isActive: true });

    if (offers) {
      return res.status(200).json(offers);
    }

    return res.json({ message: "Offers not Found!" });
  } catch (error) {
    return res.json({ message: "Offers not Found!" });
  }
};
