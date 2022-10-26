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

export class UserLoginInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditCustomerProfileInput {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}
