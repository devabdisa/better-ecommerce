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
import { addToCart } from "../../redux/features/cart/cartSlice";
import type { FC, FormEvent } from "react";
import type { RootState, ApiError, CartItem } from "../../types";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import Meta from "../../components/Meta";

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

  const addToCartHandler = () => {
    if (product) {
      const cartItem: CartItem = {
        ...product,
        qty,
      };
      dispatch(addToCart(cartItem));
      navigate("/cart");
    }
  };

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
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-20 overflow-x-hidden">
      <Meta
        title={`${product.name} | Ethio Panda`}
        description={product.description}
      />
      <div className="ml-20 pt-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 max-w-400 mx-auto px-6 lg:px-16 mt-8">
          <div className="lg:w-1/2 w-full animate-in fade-in slide-in-from-left duration-700">
            <Link
              to="/"
              className="inline-flex items-center text-gray-400 hover:text-blue-400 font-semibold transition-colors group mb-8"
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

            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-[#131316]">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-150 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
              <div className="absolute top-6 right-6 z-20 transform scale-125">
                <HeartIcon product={product} />
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 w-full lg:w-1/2 justify-center animate-in fade-in slide-in-from-right duration-700 delay-100">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tighter leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <Ratings
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
              <span className="bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-blue-500/20">
                {product.brand}
              </span>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl font-medium">
              {product.description}
            </p>

            <div className="flex items-baseline gap-4 mb-12">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-sky-300">
                $ {product.price}
              </span>
              <span className="text-gray-600 line-through text-2xl font-bold">
                $ {(product.price * 1.2).toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/3 p-8 rounded-4xl border border-white/5 backdrop-blur-md">
              <div className="space-y-5">
                <div className="flex items-center text-gray-300 group">
                  <div className="p-3 rounded-full bg-blue-500/10 mr-4 group-hover:bg-blue-500/20 transition-colors">
                    <FaStore className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-0.5">
                      Brand
                    </span>
                    <span className="font-bold">{product.brand}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-300 group">
                  <div className="p-3 rounded-full bg-blue-500/10 mr-4 group-hover:bg-blue-500/20 transition-colors">
                    <FaClock className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-0.5">
                      Added
                    </span>
                    <span className="font-bold">
                      {moment(product.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-gray-300 group">
                  <div className="p-3 rounded-full bg-yellow-500/10 mr-4 group-hover:bg-yellow-500/20 transition-colors">
                    <FaStar className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-0.5">
                      Reviews
                    </span>
                    <span className="font-bold">
                      {product.numReviews} Verified Reviews
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 border-l border-white/5 pl-6 sm:pl-6 max-sm:border-l-0 max-sm:pl-0 max-sm:border-t max-sm:pt-6">
                <div className="flex items-center text-gray-300 group">
                  <div className="p-3 rounded-full bg-yellow-500/10 mr-4 group-hover:bg-yellow-500/20 transition-colors">
                    <FaStar className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-0.5">
                      Rating
                    </span>
                    <span className="font-bold">
                      {product.rating.toFixed(1)} out of 5
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-gray-300 group">
                  <div className="p-3 rounded-full bg-blue-500/10 mr-4 group-hover:bg-blue-500/20 transition-colors">
                    <FaBox className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-0.5">
                      Stock Status
                    </span>
                    {product.countInStock > 0 ? (
                      <span className="text-green-400 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        In Stock
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap mt-8">
              {product.countInStock > 0 && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="relative">
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="p-2 w-16 pl-3 pr-8 bg-transparent text-white focus:outline-none cursor-pointer appearance-none text-center font-bold text-lg"
                    >
                      {[
                        ...Array(Math.min(product.countInStock, 10)).keys(),
                      ].map((x) => (
                        <option
                          key={x + 1}
                          value={x + 1}
                          className="text-black"
                        >
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm font-bold pr-2">
                    QTY
                  </span>
                </div>
              )}

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="flex-1 bg-linear-to-r from-blue-600 to-sky-500 text-white py-4 px-8 rounded-xl font-bold uppercase tracking-widest hover:from-blue-500 hover:to-sky-400 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
              >
                <FaShoppingCart className="group-hover:animate-bounce" />
                {product.countInStock > 0 ? "Add To Cart" : "Sold Out"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 max-w-400 mx-auto px-6 lg:px-16 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="p-10 glass rounded-[2.5rem] border border-white/5 bg-[#131316]">
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
      </div>
    </div>
  );
};

export default ProductDetails;
