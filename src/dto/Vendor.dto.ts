//dto -> data transfer object
export interface VendorCreateInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
}

export interface VendorEditInput {
  name: string;
  address: string;
  phone: string;
  foodType: [string];
}
