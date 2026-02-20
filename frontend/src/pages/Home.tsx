import { useParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import type { FC } from "react";
import type { Product as ProductType, ApiError } from "../types";
import Product from "./Products/Product";
import { FaShippingFast, FaShieldAlt, FaHeadset, FaGem } from "react-icons/fa";
import Meta from "../components/Meta";

const Home: FC = () => {
  const { keyword } = useParams<{ keyword?: string }>();
  const { data, isLoading, isError, error } = useGetProductsQuery({
    keyword: keyword || "",
  });

  const { data: categories } = useFetchCategoriesQuery();

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-primary/30 overflow-hidden relative font-sans">
      <Meta />
      {/* Dynamic Background Elements */}

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {!keyword ? <Header /> : null}

      <div className="max-w-400 mx-auto px-6 lg:px-16 py-12 relative z-10">
        {/* Trust/Features Bar */}
        {!keyword && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              {
                icon: FaShippingFast,
                title: "Express Delivery",
                desc: "Across the Region",
                color: "text-blue-500",
              },
              {
                icon: FaShieldAlt,
                title: "Secure Payment",
                desc: "100% Protected",
                color: "text-green-500",
              },
              {
                icon: FaHeadset,
                title: "Expert Support",
                desc: "24/7 Assistance",
                color: "text-purple-500",
              },
              {
                icon: FaGem,
                title: "Premium Quality",
                desc: "Authentic Goods",
                color: "text-yellow-500",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border-white/5 flex items-center gap-5 group hover:bg-white/5 transition-all duration-500"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}
                >
                  <feature.icon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Quick Links */}
        {!keyword && categories && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] block">
                  Discover
                </span>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Shop by <span className="text-primary ">Category</span>
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors"
              >
                View All Categories →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/shop?category=${category._id}`}
                  className="px-8 py-4 rounded-2xl glass-card border-white/5 text-white font-bold whitespace-nowrap hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : isError ? (
          <div className="max-w-2xl mx-auto">
            <Message variant="error">
              {(error as ApiError)?.data?.message ||
                (error as ApiError).error ||
                "Failed to load products"}
            </Message>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 relative">
              <div className="relative z-10">
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">
                  {keyword ? "Search Results" : "Featured Gallery"}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                  {keyword ? (
                    <>
                      <span className="text-text-muted">Results for:</span>{" "}
                      {keyword}
                    </>
                  ) : (
                    <>
                      Exclusive <span className="text-primary ">Stock</span>
                    </>
                  )}
                </h1>
              </div>
              <Link
                to="/shop"
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all duration-300"
              >
                Go to Shop
              </Link>
              <div className="absolute -bottom-px left-0 w-24 h-1 bg-primary"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {data?.products?.map((product: ProductType, idx: number) => (
                <div
                  key={product._id}
                  className="animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
