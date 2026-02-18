import { Link } from "react-router-dom";

import type { FC } from "react";
import type { Product } from "../../types";
import HeartIcon from "./HeartIcon";

interface SmallProductProps {
  product: Product;
}

const SmallProduct: FC<SmallProductProps> = ({ product }) => {
  return (
    <div className="group relative bg-[#131316]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl">
      <div className="relative aspect-square overflow-hidden h-40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`} className="block group/text">
          <h2 className="text-xs font-bold text-gray-200 group-hover/text:text-blue-400 transition-colors line-clamp-1 mb-2">
            {product.name}
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-white">
              ${product.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
