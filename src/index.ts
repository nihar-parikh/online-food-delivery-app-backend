// import { connectToMongo } from "./config/mongoose";
// import express from "express";
// import { AdminRoute, VendorRoute } from "./routes";
// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({
//   path: "./src/config/config.env",
// });

// const app = express();
// const PORT = 8000;
// connectToMongo(); //always after dotenv.config()

// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); //for handling files
// const imagePath = path.join(__dirname, "images");

// app.use("/images", express.static(imagePath));

// app.use("/api/v1/admin", AdminRoute);
// app.use("/api/v1/vendor", VendorRoute);

// app.listen(PORT, () => {
//   console.log(`server is running on port: ${PORT}`);
// });

import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
// import { PORT } from './config';
import dotenv from "dotenv";

const startServer = async () => {
  dotenv.config({
    path: "./src/config/config.env",
  });
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(`${process.env.PORT}`, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
  });
};

startServer();
