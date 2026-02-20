import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
// import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import Meta from "../components/Meta";
import type { FC, ChangeEvent } from "react";
import type { RootState, Category, Product } from "../types";

const Shop: FC = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state: RootState) => state.shop,
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      // Filter by brands and price on the client side if needed,
      // or rely on server-side filters.
      // Here we store what the server returned.
      dispatch(setProducts(filteredProductsQuery.data));
    }
  }, [filteredProductsQuery.data, dispatch]);

  const handleBrandClick = (brand: string) => {
    // Brand filtering logic can be added here
  };

  const handleCheck = (value: boolean, id: string) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    dispatch(setChecked(all));
  };

  const allBrands = [
    ...new Set(products.map((product: Product) => product.brand)),
  ];

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update price filter
    setPriceFilter(e.target.value);
  };

  return (
    <div className="ml-20 min-h-screen bg-[#0a0a0c] text-white">
      <Meta
        title="Shop | Premium Collection"
        description="Browse our exclusive collection of high-quality products. Filter by category, brand, and price."
      />
      <div className="flex flex-col md:flex-row relative">
        {/* Sidebar Filters */}
        <div className="md:w-[20%] p-6 bg-[#131316] border-r border-white/5 h-auto md:min-h-screen sticky top-0 overflow-y-auto">
          <h2 className="text-sm font-black mb-6 text-white border-b border-white/10 pb-4 uppercase tracking-widest flex items-center justify-between">
            Filter by Category
            <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white">
              {categories?.length || 0}
            </span>
          </h2>
          <div className="space-y-3 mb-10">
            {categories?.map((c: Category) => (
              <div
                key={c._id}
                className="flex items-center group cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={c._id}
                  className="w-4 h-4 text-blue-600 bg-black/50 border-gray-700 rounded focus:ring-blue-500 focus:ring-offset-0 focus:ring-2 accent-blue-600 transition-all cursor-pointer"
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                />
                <label
                  htmlFor={c._id}
                  className="ml-3 text-sm font-medium text-gray-400 group-hover:text-white transition-colors cursor-pointer select-none"
                >
                  {c.name}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-black mb-6 text-white border-b border-white/10 pb-4 uppercase tracking-widest flex items-center justify-between">
            Filter by Brand
            <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white">
              {allBrands?.length || 0}
            </span>
          </h2>
          <div className="space-y-3 mb-10">
            {allBrands?.map((brand) => (
              <div
                key={brand as string}
                className="flex items-center group cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  className="w-4 h-4 text-blue-600 bg-black/50 border-gray-700 rounded focus:ring-blue-500 focus:ring-offset-0 focus:ring-2 accent-blue-600 transition-all cursor-pointer"
                  onChange={(e) => handleBrandClick(brand as string)}
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-3 text-sm font-medium text-gray-400 group-hover:text-white transition-colors cursor-pointer select-none"
                >
                  {brand as string}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-black mb-6 text-white border-b border-white/10 pb-4 uppercase tracking-widest">
            Filter by Price
          </h2>
          <div className="p-2 mb-10 bg-black/20 rounded-xl border border-white/5">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full p-3 bg-transparent border-0 focus:ring-0 text-white placeholder-gray-600 font-bold"
            />
          </div>

          <button
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors duration-300 transform active:scale-95 text-xs shadow-lg shadow-white/10"
            onClick={() => window.location.reload()}
          >
            Reset All Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="md:w-[80%] p-8 bg-[#0a0a0c]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
            <div>
              <span className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">
                Browse Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                Shop Products
              </h1>
            </div>
            <span className="text-sm font-bold text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest">
              {products?.length} Items Found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-40 opacity-30">
                <p className="text-2xl font-black uppercase tracking-widest text-gray-500">
                  No products matching your filters
                </p>
              </div>
            ) : (
              products.map((p: Product) => (
                <div
                  key={p._id}
                  className="animate-in fade-in slide-in-from-bottom duration-700"
                >
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
