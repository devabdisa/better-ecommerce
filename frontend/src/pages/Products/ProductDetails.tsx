import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
// import { addToCart } from "../../redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { FC, FormEvent } from "react";
import type { RootState, ApiError, CartItem } from "../../types";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";

const ProductDetails: FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [qty, setQty] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId || "");

  const { userInfo } = useAppSelector((state: RootState) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!productId) return;
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(
        apiError?.data?.message || apiError.error || "Review creation failed",
      );
    }
  };

  // const addToCartHandler = () => {
  //   if (product) {
  //     const cartItem: CartItem = {
  //       ...product,
  //       qty,
  //     };
  //     dispatch(addToCart(cartItem));
  //     navigate("/cart");
  //   }
  // };

  if (isLoading) return <Loader />;

  if (error) {
    const apiError = error as ApiError;
    return (
      <div className="ml-40 mt-20">
        <Message variant="error">
          {apiError?.data?.message || apiError.error || "Something went wrong"}
        </Message>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <div className="ml-40 pt-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-blue-400 font-semibold transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Back
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-start mt-8 ml-40 gap-12 mr-10">
        <div className="relative group lg:w-1/2 w-full">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900/50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <HeartIcon product={product} />
        </div>

        <div className="flex flex-col flex-1 w-full lg:w-1/2">
          <h2 className="text-4xl font-bold mb-4 text-gray-100">
            {product.name}
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
            <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
              {product.brand}
            </span>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            {product.description}
          </p>

          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-5xl font-black text-blue-400">
              $ {product.price}
            </span>
            <span className="text-gray-500 line-through text-xl">
              $ {(product.price * 1.2).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="space-y-4">
              <h1 className="flex items-center text-gray-300">
                <FaStore className="mr-3 text-blue-400" />{" "}
                <span className="text-gray-500 mr-2">Brand:</span>{" "}
                {product.brand}
              </h1>
              <h1 className="flex items-center text-gray-300">
                <FaClock className="mr-3 text-blue-400" />{" "}
                <span className="text-gray-500 mr-2">Added:</span>{" "}
                {moment(product.createdAt).fromNow()}
              </h1>
              <h1 className="flex items-center text-gray-300">
                <FaStar className="mr-3 text-yellow-500" />{" "}
                <span className="text-gray-500 mr-2">Reviews:</span>{" "}
                {product.numReviews}
              </h1>
            </div>

            <div className="space-y-4">
              <h1 className="flex items-center text-gray-300">
                <FaStar className="mr-3 text-yellow-500" />{" "}
                <span className="text-gray-500 mr-2">Rating:</span>{" "}
                {product.rating.toFixed(1)}
              </h1>
              {/* <h1 className="flex items-center text-gray-300">
                <FaShoppingCart className="mr-3 text-blue-400" />{" "}
                <span className="text-gray-500 mr-2">Quantity:</span>{" "}
                {product.quantity}
              </h1> */}
              <h1 className="flex items-center text-gray-300">
                <FaBox className="mr-3 text-blue-400" />{" "}
                <span className="text-gray-500 mr-2">Availability:</span>
                {product.countInStock > 0 ? (
                  <span className="text-green-400 ml-2 font-bold px-2 py-0.5 bg-green-400/10 rounded border border-green-500/20">
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-400 ml-2 font-bold px-2 py-0.5 bg-red-400/10 rounded border border-red-500/20">
                    Out of Stock
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* <div className="flex items-center gap-6 flex-wrap">
            {product.countInStock > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-gray-400 font-bold uppercase text-xs tracking-wider">
                  Qty
                </label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-3 w-20 rounded-xl bg-surface text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none text-center font-bold"
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="flex-1 bg-linear-to-r from-blue-600 to-sky-600 text-white py-4 px-8 rounded-xl font-black uppercase tracking-widest hover:from-blue-700 hover:to-sky-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <FaShoppingCart />
              {product.countInStock > 0 ? "Add To Cart" : "Sold Out"}
            </button>
          </div> */}
        </div>
      </div>

      <div className="mt-32 ml-40 mr-10 p-8 glass rounded-3xl border border-white/10">
        <ProductTabs
          loadingProductReview={loadingProductReview}
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          product={product}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
