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

export interface OfferAddInput {
  offerType: string; //VENDOR OR GENERIC
  vendor: string;
  title: string; //INR 200 OFF
  description: string; //WEEKEND OFFER AND all terms and condition
  minValue: number; //min quantity user should buy to avail offer
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promoCode: string; //WEEK200
  promoType: string; //USER //ALL //BANK //CARD
  bank: [any];
  bins: [any];
  pinCode: string; //searching offers by location
  isActive: boolean;
}
