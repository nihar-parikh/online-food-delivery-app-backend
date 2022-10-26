import express, { Application } from "express";
import path from "path";

import {
  AdminRoute,
  VendorRoute,
  CustomerRoute,
  ShoppingRoute,
} from "../routes";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());

  const imagePath = path.join(__dirname, "../images");

  app.use("/images", express.static(imagePath));

  app.use("/api/v1/admin", AdminRoute);
  app.use("/api/v1/vendor", VendorRoute);
  app.use("/api/v1/customer", CustomerRoute);

  app.use("/api/v1/shopping", ShoppingRoute);

  return app;
};
