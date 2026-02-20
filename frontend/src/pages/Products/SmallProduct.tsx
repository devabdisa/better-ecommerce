import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import type { FC } from "react";
import type { Product } from "../../types";
import HeartIcon from "./HeartIcon";
import { resolveImageUrl } from "../../utils/imageUrl";

interface SmallProductProps {
  product: Product;
}

const SmallProduct: FC<SmallProductProps> = ({ product }) => {
  return (
    <div className="group relative bg-[#131316]/60 backdrop-blur-xl rounded-[1.5rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl flex items-center h-28 transform hover:scale-[1.02]">
      <div className="relative w-28 h-28 overflow-hidden bg-[#0d0d10] flex-shrink-0">
        <img
          src={resolveImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div
          className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 origin-top-left"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartIcon product={product} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="p-5 flex-1 min-w-0">
        <Link to={`/product/${product._id}`} className="block group/text">
          <div className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
            {product.brand}
          </div>
          <h2 className="text-xs font-bold text-white group-hover/text:text-primary transition-colors line-clamp-1 mb-2 font-sans tracking-tight">
            {product.name}
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-white ">
              ${product.price}
            </span>
            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-text-muted group-hover/text:bg-primary group-hover/text:text-white transition-all">
              <FaArrowRight size={8} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
