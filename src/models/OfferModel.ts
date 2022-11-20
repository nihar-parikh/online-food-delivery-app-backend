import mongoose, { Schema, Document, Model } from "mongoose";

export interface OfferDoc extends Document {
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

const OfferSchema = new Schema(
  {
    offerType: { type: String, required: true }, //VENDOR OR GENERIC
    vendor: { type: Schema.Types.ObjectId, ref: "vendor" },
    title: { type: String, required: true }, //INR 200 OFF
    description: { type: String }, //WEEKEND OFFER AND all terms and condition
    minValue: { type: Number, required: true }, //min quantity user should buy to avail offer
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date, required: true },
    endValidity: { type: Date, required: true },
    promoCode: { type: String, required: true }, //WEEK200
    promoType: { type: String, required: true }, //USER //ALL //BANK //CARD
    bank: [{ type: String }],
    bins: [{ type: Number }],
    pinCode: { type: String, required: true }, //searching offers by location
    isActive: { type: Boolean, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);

export { Offer };
