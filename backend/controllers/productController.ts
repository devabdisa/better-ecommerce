import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { Request, Response } from "express";

const addProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, quantity, brand } = (req as any)
      .fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = new Product({ ...(req as any).fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json((error as Error).message);
  }
});

const updateProductDetails = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { name, description, price, category, quantity, brand } = (
        req as any
      ).fields;

      // Validation
      switch (true) {
        case !name:
          return res.json({ error: "Name is required" });
        case !brand:
          return res.json({ error: "Brand is required" });
        case !description:
          return res.json({ error: "Description is required" });
        case !price:
          return res.json({ error: "Price is required" });
        case !category:
          return res.json({ error: "Category is required" });
        case !quantity:
          return res.json({ error: "Quantity is required" });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...(req as any).fields },
        { new: true },
      );

      if (product) {
        await product.save();
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json((error as Error).message);
    }
  },
);

const removeProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword as string,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === (req as any).user._id.toString(),
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: (req as any).user.username,
        rating: Number(rating),
        comment,
        user: (req as any).user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json((error as Error).message);
  }
});

const fetchTopProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json((error as Error).message);
  }
});

const fetchNewProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json((error as Error).message);
  }
});

const filterProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { checked, radio } = req.body;

    let args: any = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
