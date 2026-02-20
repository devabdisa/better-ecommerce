import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
// @ts-ignore
const SliderComponent = Slider.default || Slider;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaStar, FaStore, FaArrowRight } from "react-icons/fa";
import type { FC } from "react";
import type { Product, ApiError } from "../../types";

const ProductCarousel: FC = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.87, 0.03, 0.4, 0.9)",
    pauseOnHover: true,
  };

  return (
    <div className="mb-8 lg:block xl:block md:block mt-8">
      {isLoading ? null : error ? (
        <Message variant="error">
          {(error as ApiError)?.data?.message ||
            (error as ApiError).error ||
            "Error loading carousel"}
        </Message>
      ) : (
        <SliderComponent
          {...settings}
          className="mx-auto rounded-[2rem] overflow-hidden glass-card shadow-2xl relative"
        >
          {products?.map((product: Product) => (
            <div
              key={product._id}
              className="relative group w-full h-[500px] md:h-[600px] overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-[#0a0a0c]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-1000 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
              </div>

              <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-end">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
                  <div className="flex-1 space-y-6 max-w-2xl">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-[2px] bg-primary"></div>
                        <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] block">
                          Trending Now
                        </span>
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] group-hover:text-primary transition-colors duration-500 font-sans">
                        {product.name}
                      </h2>
                    </div>

                    <p className="text-text-muted line-clamp-2 text-lg font-medium leading-relaxed max-w-xl">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                      <Link
                        to={`/product/${product._id}`}
                        className="px-10 py-5 bg-primary text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 transform hover:scale-105 active:scale-95 group/btn"
                      >
                        Explore Collection
                        <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>

                      <div className="flex items-baseline gap-3">
                        <span className="text-white font-black text-3xl italic font-sans">
                          ${product.price}
                        </span>
                        {product.price > 100 && (
                          <span className="text-text-muted line-through text-sm font-bold">
                            ${(product.price * 1.2).toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-8 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl animate-in fade-in slide-in-from-right duration-1000">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em] block">
                          Brand
                        </span>
                        <h4 className="flex items-center text-[10px] font-bold text-white uppercase tracking-widest">
                          <FaStore className="mr-2 text-primary" size={12} />
                          {product.brand}
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em] block">
                          Arrival
                        </span>
                        <h4 className="flex items-center text-[10px] font-bold text-white uppercase tracking-widest">
                          <FaClock className="mr-2 text-primary" size={12} />
                          {moment(product.createdAt).fromNow()}
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-4 border-l border-white/10 pl-8">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em] block">
                          Rating
                        </span>
                        <h4 className="flex items-center text-[10px] font-bold text-white uppercase tracking-widest">
                          <FaStar className="mr-2 text-yellow-500" size={12} />
                          {product.rating.toFixed(1)} / 5.0
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em] block">
                          Availability
                        </span>
                        <h4 className="flex items-center text-[10px] font-bold text-white uppercase tracking-widest">
                          <FaBox className="mr-2 text-green-500" size={12} />
                          {product.countInStock > 0 ? "In Stock" : "Limited"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </SliderComponent>
      )}
    </div>
  );
};

export default ProductCarousel;
