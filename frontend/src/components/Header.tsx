import { useGetNewProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

import type { FC } from "react";
import type { Product } from "../types";
import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct";

const Header: FC = () => {
  const { data, isLoading, error } = useGetNewProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <h1 className="text-red-500 font-bold">Error loading header</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row justify-between items-start gap-12 max-w-[1400px] mx-auto px-6 lg:px-12 pt-12">
      <div className="xl:block hidden w-1/3">
        <div className="grid grid-cols-2 gap-6">
          {data?.slice(0, 4).map((product: Product) => (
            <div
              key={product._id}
              className="animate-in fade-in zoom-in duration-500"
            >
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 w-full xl:max-w-none">
        <div className="rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5 bg-[#0d0d0f]">
          <ProductCarousel />
        </div>
      </div>
    </div>
  );
};

export default Header;
