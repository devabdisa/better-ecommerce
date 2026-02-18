import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import type { FC } from "react";
import type { Product } from "../../types";

interface ProductCardProps {
  p: Product;
}

const ProductCard: FC<ProductCardProps> = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product: Product, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-sm relative glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-transparent hover:border-blue-500/30">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-blue-100/10 backdrop-blur-md text-blue-400 text-xs font-bold mr-2 px-3 py-1 rounded-full border border-blue-500/20 z-10">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={p.image}
            alt={p.name}
            style={{ height: "180px" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5 bg-surface">
        <div className="flex justify-between items-start mb-3">
          <h5
            className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 flex-1 mr-2"
            title={p?.name}
          >
            {p?.name}
          </h5>

          <p className="text-blue-400 font-extrabold text-lg">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-5 font-normal text-gray-400 text-sm line-clamp-2 min-h-10">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-bold text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 transition-all duration-300 shadow-md"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
            onClick={() => addToCartHandler(p, 1)}
            title="Add to cart"
          >
            <AiOutlineShoppingCart size={22} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
