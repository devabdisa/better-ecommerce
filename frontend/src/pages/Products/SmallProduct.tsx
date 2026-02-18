import { Link } from "react-router-dom";

import type { FC } from "react";
import type { Product } from "../../types";
import HeartIcon from "./HeartIcon";

interface SmallProductProps {
  product: Product;
}

const SmallProduct: FC<SmallProductProps> = ({ product }) => {
  return (
    <div className="group relative bg-[#131316]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl flex items-center h-28">
      <div className="relative w-28 h-28 overflow-hidden bg-[#0d0d10] flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div
          className="absolute top-1 left-1 transform scale-75 origin-top-left z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4 flex-1 min-w-0">
        <Link to={`/product/${product._id}`} className="block group/text">
          <h2 className="text-sm font-bold text-gray-200 group-hover/text:text-blue-400 transition-colors line-clamp-1 mb-2">
            {product.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
              ${product.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
