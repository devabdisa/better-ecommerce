import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import type { FC } from "react";
import type { Product as ProductType } from "../../types";

interface ProductProps {
  product: ProductType;
}

const Product: FC<ProductProps> = ({ product }) => {
  return (
    <div className="group relative bg-[#131316] rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full">
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#0a0a0c]">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        <HeartIcon product={product} />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <Link to={`/product/${product._id}`} className="block mb-2 group/title">
          <h2 className="text-xl font-bold text-gray-100 group-hover/title:text-blue-400 transition-colors line-clamp-1">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-2xl font-black text-white tracking-tight">
            ${product.price}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
            {product.brand}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
