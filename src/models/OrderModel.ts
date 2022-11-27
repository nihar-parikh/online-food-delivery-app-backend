import mongoose, { Schema, Document, Model } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string; //we don't want to give long default id to customer->unable to remember
  vendorId: string;
  items: [any];
  totalAmount: number;
  paidAmount: number;
  orderDate: Date;
  // paidThrough: string; //not requried as it is already added in transaction model
  // paymentResponse: string; //not requried as it is already added in transaction model //{long response object for charge back scenerio}
  orderStatus: string; // ->customer side->WAITING/FAILED  ->vendor side->ACCEPT/REJECT/UNDER-PROCESS/READY
  remarks: string; //to cancel order then some remark is required
  deliveryId: string; //to get track of order
  // appliedOffers: boolean; //not requried as it is already added in transaction model
  // offerId: string; //not requried as it is already added in transaction model
  readyTime: number;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true },
    vendorId: { type: String, required: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        units: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, require: true },
    orderDate: { type: Date },
    remarks: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number },
    // paidThrough: { type: String },
    // paymentResponse: { type: String },
    orderStatus: { type: String },
    // appliedOffers: { type: Boolean },
    // offerId: { type: String },
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

const Order = mongoose.model<OrderDoc>("order", OrderSchema);

export { Order };
