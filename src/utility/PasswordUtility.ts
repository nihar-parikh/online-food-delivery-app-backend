import { AuthPayload } from "./../dto/Auth.dto";
import { VendorPayload } from "./../dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generatePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

export const generateToken = async (payload: VendorPayload) => {
  return jwt.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
};

export const validateToken = async (req: Request) => {
  //first set Bearer token in vendor folder in thunder client(postman) ->setting ->any files inside this folder can access this token
  const token = req.get("Authorization");

  if (token) {
    const decodedUserData = jwt.verify(
      token.split(" ")[1],
      `${process.env.JWT_SECRET}`
    ) as AuthPayload;

    req.user = decodedUserData;

    return true;
  }
  return false;
};
