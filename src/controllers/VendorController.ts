import { validatePassword, generateToken } from "./../utility/PasswordUtility";
import { findVendor } from "./AdminController";
import { Request, Response, NextFunction } from "express";
import { OfferAddInput, VendorEditInput, VendorLoginInput } from "../dto";
import { Food, Vendor } from "../models";
import { FoodCreateInput } from "../dto/Food.dto";
import { Order } from "../models/OrderModel";
import { Offer } from "../models/OfferModel";

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
  const { lat, lng } = req.body;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      if (lat && lng) {
        existingVendor.lat = lat;
        existingVendor.lng = lng;
      }

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

//--------------order section------------//
export const getCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;

    if (vendor) {
      const orders = await Order.find({ vendorId: vendor._id }).populate(
        "items.food"
      );

      if (orders.length !== 0) {
        return res.status(200).json(orders);
      }
    }
    return res.status(404).json({ message: "Orders Not found" });
  } catch (error) {
    return res.status(404).json({ message: "Orders Not found" });
  }
};

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("items.food");

    if (order) {
      return res.status(200).json(order);
    }

    return res.status(404).json({ message: "Orders Not found" });
  } catch (error) {
    return res.status(404).json({ message: "Orders Not found" });
  }
};

export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderStatus, remarks, readyTime } = req.body;

    const orderId = req.params.orderId;

    let order = await Order.findById(orderId).populate("items.food");

    if (order) {
      order.orderStatus = orderStatus;
      order.remarks = remarks;
      order.readyTime = readyTime;

      order = await order.save();
      return res.status(200).json(order);
    }

    return res.status(404).json({ message: "Unable to process order" });
  } catch (error) {
    return res.status(404).json({ message: "Unable to process order" });
  }
};

//offers
export const addOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //validation of login user ->same for customer and user
    const user = req.user;

    if (user) {
      const {
        offerType,
        title,
        description,
        minValue,
        offerAmount,
        startValidity,
        endValidity,
        promoCode,
        promoType,
        bank,
        bins,
        pinCode,
        isActive,
      } = <OfferAddInput>req.body;

      //checking if really vendor is available or not
      const vendor = await findVendor(user._id);

      if (vendor) {
        const offer = await Offer.create({
          offerType,
          title,
          description,
          minValue,
          offerAmount,
          startValidity,
          endValidity,
          promoCode,
          promoType,
          bank,
          bins,
          pinCode,
          isActive,
          vendor: vendor._id,
        });

        if (offer) {
          return res.status(201).json(offer);
        }
      }
    }
  } catch (error) {
    return res.status(404).json({ message: "Unable to add offer" });
  }
};

export const getOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;

    if (vendor) {
      const offers = await Offer.find({
        vendor: vendor._id,
      }).populate("vendor");
      if (offers) {
        return res.status(200).json(offers);
      }
    }

    return res.json({ message: "Offers Not available" });
  } catch (error) {
    return res.json({ message: "Offers Not available" });
  }
};

export const editOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const offerId = req.params.offerId;

  if (user) {
    const {
      title,
      description,
      offerType,
      offerAmount,
      pinCode,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      minValue,
      isActive,
    } = <OfferAddInput>req.body;

    const currentOffer = await Offer.findById(offerId);

    if (currentOffer) {
      const vendor = await findVendor(user._id);

      if (vendor) {
        (currentOffer.title = title),
          (currentOffer.description = description),
          (currentOffer.offerType = offerType),
          (currentOffer.offerAmount = offerAmount),
          (currentOffer.pinCode = pinCode),
          (currentOffer.promoType = promoType),
          (currentOffer.promoCode = promoCode),
          (currentOffer.startValidity = startValidity),
          (currentOffer.endValidity = endValidity),
          (currentOffer.bank = bank),
          (currentOffer.bins = bins),
          (currentOffer.isActive = isActive),
          (currentOffer.minValue = minValue);

        const result = await currentOffer.save();

        return res.status(200).json(result);
      }
    }
  }

  return res.json({ message: "Unable to edit Offer!" });
};

export const deleteOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};
