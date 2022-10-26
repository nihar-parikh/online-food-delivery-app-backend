import mongoose, { Schema, Document, Model } from "mongoose";

export interface FoodDoc extends Document {
  vendorId: string; //helpful in searching foods by vendorId
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  ratings: number;
  images: [string];
}

const FoodSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number },
    ratings: { type: Number },
    images: { type: [String] },
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

const Food = mongoose.model<FoodDoc>("food", FoodSchema);

export { Food };
