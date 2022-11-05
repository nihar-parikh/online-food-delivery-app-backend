import { IsEmail, Length } from "class-validator";
//make these changes in tsconfig file while using class-validator
// "experimentalDecorators": true /* Enable experimental support for TC39 stage 2 draft decorators. */,
// "strictPropertyInitialization": false /* Check for class properties that are declared but not set in the constructor. */,

export class CustomerCreateInput {
  //decorators
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CustomerVerifyInput {
  otp: number;
}

export class CustomerLoginInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class CustomerEditProfileInput {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}
