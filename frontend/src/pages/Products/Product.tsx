import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { FaArrowRight } from "react-icons/fa";
import type { FC } from "react";
import type { Product as ProductType } from "../../types";
import { resolveImageUrl } from "../../utils/imageUrl";

interface ProductProps {
  product: ProductType;
}

const Product: FC<ProductProps> = ({ product }) => {
  return (
    <div className="group relative glass-card rounded-[2rem] overflow-hidden border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col h-full transform hover:-translate-y-2">
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#0d0d0f]">
        <Link to={`/product/${product._id}`}>
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        <div className="absolute top-4 right-4 z-20">
          <HeartIcon product={product} />
        </div>

        {product.countInStock <= 5 && product.countInStock > 0 && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md rounded-lg">
            <span className="text-[8px] font-bold text-yellow-500 uppercase tracking-widest">
              Low Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1 relative z-10">
        <Link to={`/product/${product._id}`} className="block mb-3 group/title">
          <h2 className="text-xl font-bold text-white group-hover/title:text-primary transition-colors line-clamp-1 font-sans">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            {product.brand}
          </span>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            New Arrival
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
          <span className="text-2xl font-black text-white tracking-tighter ">
            ${product.price}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-all group/arrow"
          >
            <FaArrowRight className="text-sm group-hover/arrow:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
