import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import type { FC } from "react";
import type { Product as ProductType, ApiError } from "../types";
import Product from "./Products/Product";

const Home: FC = () => {
  const { keyword } = useParams<{ keyword?: string }>();
  const { data, isLoading, isError, error } = useGetProductsQuery({
    keyword: keyword || "",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px]" />
      </div>

      {!keyword ? <Header /> : null}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 py-16 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
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
          <div className="space-y-16">
            <div className="relative group">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b border-white/5 pb-8 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs mb-3 block animate-in fade-in slide-in-from-left duration-700">
                    Curated Collection
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom duration-1000">
                    {keyword ? (
                      <>
                        <span className="text-gray-500">Search:</span> {keyword}
                      </>
                    ) : (
                      "Special Products"
                    )}
                  </h1>
                </div>

                <div className="absolute -bottom-px left-0 w-32 h-1 bg-linear-to-r from-blue-600 to-transparent"></div>
              </div>
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
