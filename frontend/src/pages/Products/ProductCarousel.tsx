import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
// @ts-ignore
const SliderComponent = Slider.default || Slider;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaStar, FaStore } from "react-icons/fa";
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
    autoplaySpeed: 4000,
    cssEase: "cubic-bezier(0.87, 0.03, 0.4, 0.9)",
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
          className="xl:w-200 lg:w-180 md:w-160 sm:w-140 mx-auto rounded-2xl overflow-hidden glass shadow-2xl"
        >
          {products?.map((product: Product) => (
            <div
              key={product._id}
              className="relative group w-full h-125 md:h-150"
            >
              <div className="absolute inset-0 w-full h-full bg-[#0a0a0c]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">
                      Featured Product
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none group-hover:text-blue-400 transition-colors duration-500">
                      {product.name}
                    </h2>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <p className="text-blue-400 font-black text-3xl">
                      ${product.price}
                    </p>
                    {product.price > 100 && (
                      <p className="text-gray-600 line-through text-lg font-medium">
                        ${(product.price * 1.2).toFixed(0)}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-400 line-clamp-2 max-w-xl text-lg font-medium leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-4 p-6 bg-white/3 backdrop-blur-md rounded-2xl border border-white/5">
                  <div className="space-y-3">
                    <h1 className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <FaStore className="mr-2 text-blue-500/70" />
                      {product.brand}
                    </h1>
                    <h1 className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <FaClock className="mr-2 text-blue-500/70" />
                      {moment(product.createdAt).fromNow()}
                    </h1>
                  </div>

                  <div className="space-y-3 border-l border-white/10 pl-10">
                    <h1 className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <FaStar className="mr-2 text-yellow-500/70" />
                      {product.rating.toFixed(1)}
                    </h1>
                    <h1 className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <FaBox className="mr-2 text-blue-500/70" />
                      {product.countInStock > 0 ? "In Stock" : "Sold Out"}
                    </h1>
                    {/* <h1 className="flex items-center">
                      <FaShoppingCart className="mr-2 text-blue-400" />{" "}
                      <span className="text-gray-400 mr-1">Quantity:</span>{" "}
                      {product.quantity}
                    </h1> */}
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
