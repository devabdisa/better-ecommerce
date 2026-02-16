import mongoose, { Document, Schema } from "mongoose";
const { ObjectId } = mongoose.Schema;

export interface IReview {
  name: string;
  rating: number;
  comment: string;
  user: mongoose.Types.ObjectId;
}

export interface IProduct extends Document {
  name: string;
  image: string;
  brand: string;
  quantity: number;
  category: mongoose.Types.ObjectId;
  description: string;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
