import { useAppSelector } from "../../redux/hooks";
import Product from "./Product";
import type { FC } from "react";
import type { Product as ProductType } from "../../types";

const Favorites: FC = () => {
  const favorites = useAppSelector((state) => state.favorites) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-blue-500/30 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="relative group mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b border-white/5 pb-8 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs mb-3 block animate-in fade-in slide-in-from-left duration-700">
                Your Saved items
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom duration-1000">
                Favorite Products
              </h1>
            </div>
            <div className="absolute -bottom-px left-0 w-32 h-1 bg-linear-to-r from-blue-600 to-transparent"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {favorites.length > 0 ? (
            favorites.map((product: ProductType, idx: number) => (
              <div
                key={product._id}
                className="animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Product product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-50 space-y-6">
              <div className="p-8 rounded-full bg-white/5 border border-white/10 relative group">
                <svg
                  className="w-20 h-20 text-gray-700 transition-transform duration-500 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl -z-10" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                  No Favorites Yet
                </p>
                <p className="text-gray-500 max-w-xs">
                  Items you add to your favorites will appear here for quick
                  access.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
