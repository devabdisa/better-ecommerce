import mongoose, { Document, Schema } from "mongoose";

interface IOrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: mongoose.Schema.Types.ObjectId;
}

interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface IPaymentResult {
  tx_ref: string;
  chapa_ref: string;
  status: string;
  payment_method: string;
  paid_at: string;
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult: IPaymentResult;
  chapaTxRef: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentResult: {
      tx_ref: { type: String },
      chapa_ref: { type: String },
      status: { type: String },
      payment_method: { type: String },
      paid_at: { type: String },
    },

    // Unique Chapa transaction reference for idempotency
    chapaTxRef: {
      type: String,
      unique: true,
      sparse: true, // Allow null values while maintaining uniqueness
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
