import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import {
  CartInputs,
  CustomerCreateInput,
  CustomerEditProfileInput,
  CustomerLoginInput,
  CustomerVerifyInput,
  OrderInputs,
} from "../dto";
import { Customer, Food } from "../models";
import { Offer } from "../models/OfferModel";
import { Order } from "../models/OrderModel";
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

//----------cart section---------//

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;

    if (customer) {
      const customerProfile = await Customer.findById(customer._id);

      let cartItems = Array();

      const { _id, units } = <CartInputs>req.body;

      const food = await Food.findById(_id);

      if (food) {
        if (customerProfile) {
          cartItems = customerProfile.cart;

          if (cartItems.length > 0) {
            // check and update
            let existFoodItems = cartItems.filter(
              (item) => item.food._id.toString() === _id
            );

            if (existFoodItems.length > 0) {
              const index = cartItems.indexOf(existFoodItems[0]);

              if (units > 0) {
                // const foodId = food._id.toString();
                cartItems[index] = { food, units };
              } else {
                cartItems.splice(index, 1);
              }
            } else {
              cartItems.push({ food, units });
            }
          } else {
            // add new Item
            cartItems.push({ food, units });
          }

          if (cartItems) {
            customerProfile.cart = cartItems as any;
            const cartResult = await customerProfile.save();
            return res.status(200).json(cartResult.cart);
          }
        }
      }
    }
    return res.status(404).json({ msg: "Unable to add to cart!" });
  } catch (error) {
    return res.status(404).json({ msg: "Unable to add to cart!" });
  }
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const customerProfile = await Customer.findById(customer._id).populate(
      "cart.food"
    );

    if (customerProfile) {
      return res.status(200).json(customerProfile.cart);
    }
  }

  return res.status(400).json({ message: "Cart is Empty!" });
};

export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const customerProfile = await Customer.findById(customer._id)
      .populate("cart.food")
      .exec();

    if (customerProfile) {
      customerProfile.cart = [] as any;
      const cartResult = await customerProfile.save();

      return res.status(200).json(cartResult);
    }
  }

  return res.status(400).json({ message: "cart is Already Empty!" });
};
//--------order section --------//

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //grab login customer
    const customer = req.user;

    if (customer) {
      const customerProfile = await Customer.findById(customer._id);

      //create an order ID
      const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

      //grab order items from req.body
      const order = <[OrderInputs]>req.body; //[{id:1,units:3}]

      let orderItems = Array();

      let netAmount = 0.0;
      let vendorId = "";
      const foods = await Food.find()
        .where("_id")
        .in(order.map((item) => item._id))
        .exec();

      //calculate order amount
      foods.map((food) => {
        order.map(({ _id, units }) => {
          if (food._id.toString() === _id.toString()) {
            vendorId = food.vendorId;
            netAmount += food.price * units;
            orderItems.push({ food, units });
          }
        });
      });

      if (orderItems) {
        //create order with item description
        const newOrder = await Order.create({
          orderId: orderId,
          vendorId: vendorId,
          items: orderItems,
          totalAmount: netAmount,
          orderDate: new Date(),
          paidThrough: "Cash On Delivery",
          paymentResponse: "",
          orderStatus: "waiting",
          remarks: "",
          deliveryId: "",
          appliedOffers: false,
          offerId: "",
          readyTime: 45,
        });

        if (newOrder) {
          //update order to customer profile
          //once an order is placed, the cart should be empty
          customerProfile.cart = [] as any;
          customerProfile.orders.push(newOrder);
          await customerProfile.save();
          return res.status(201).json(newOrder);
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Unable to generate new order" });
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const customerProfile = await Customer.findById(customer._id).populate(
      "orders"
    );

    if (customerProfile) {
      return res.status(200).json(customerProfile.orders);
    }
  }

  return res.status(400).json({ msg: "Orders not found" });
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("items.food");
    if (order) {
      return res.status(200).json(order);
    }
    return res.status(404).json({ message: "order not found" });
  } catch (error) {
    return res.status(404).json({ message: "order not found" });
  }
};

//offers
export const applyForOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;
    const offerId = req.params.offerId;

    if (customer) {
      const offer = await Offer.findOne({
        _id: offerId,
        isActive: true,
      }).populate("vendor");

      if (offer) {
        return res.status(200).json({ message: "Offer is valid", offer });
      }
    }
    return res.status(400).json({ msg: "Offer is Not Valid" });
  } catch (error) {
    return res.status(400).json({ msg: "Offer is Not Valid" });
  }
};

//create payment
export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const { amount, paymentMode, offerId } = req.body;

  if (offerId) {
    let payableAmount = 0;
    const appliedOffer = await Offer.findOne({
      _id: offerId,
      isActive: true,
    });

    if (appliedOffer) {
      payableAmount = amount - appliedOffer.offerAmount;
    }
  }

  //perform payment gateway charge api call

//create record on transaction

//return transaction id
};
