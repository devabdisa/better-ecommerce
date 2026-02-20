import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import moment from "moment";
import type { FC, FormEvent } from "react";
import type { Product, UserInfo } from "../../types";
import SmallProduct from "./SmallProduct";
import Ratings from "./Ratings";

interface ProductTabsProps {
  loadingProductReview: boolean;
  userInfo: UserInfo | null;
  submitHandler: (e: FormEvent) => void;
  rating: number;
  setRating: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  product: Product;
}

const ProductTabs: FC<ProductTabsProps> = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data: relatedProducts, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <section className="lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
        {[
          { id: 1, label: "Write Your Review" },
          { id: 2, label: "All Reviews" },
          { id: 3, label: "Related Products" },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`py-4 px-6 cursor-pointer text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-xl whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-lg"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </section>

      <section className="lg:w-3/4">
        {activeTab === 1 && (
          <div className="animate-fade-in-up">
            {userInfo ? (
              <form onSubmit={submitHandler} className="max-w-xl space-y-6">
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-lg font-bold mb-3 text-gray-200 uppercase tracking-wide"
                  >
                    Rate this product
                  </label>

                  <div className="relative">
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="p-4 w-full rounded-xl bg-surface text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none font-bold"
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Inferior</option>
                      <option value="2">2 - Decent</option>
                      <option value="3">3 - Great</option>
                      <option value="4">4 - Excellent</option>
                      <option value="5">5 - Exceptional</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="comment"
                    className="block text-lg font-bold mb-3 text-gray-200 uppercase tracking-wide"
                  >
                    Share your thoughts
                  </label>

                  <textarea
                    id="comment"
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                    className="p-4 w-full rounded-xl bg-surface text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-all min-h-37.5 placeholder-gray-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-blue-600 text-white py-4 px-10 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all duration-300 shadow-xl disabled:opacity-50"
                >
                  {loadingProductReview ? "Submitting..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center">
                <p className="text-gray-400">
                  Sign in to join the conversation and share your experience.
                </p>
                <Link
                  to="/login"
                  className="inline-block mt-4 text-blue-400 font-bold hover:underline"
                >
                  Login to Review →
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="animate-fade-in-up space-y-6">
            {product.reviews.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                <p className="text-xl font-bold uppercase tracking-widest">
                  No reviews yet
                </p>
              </div>
            ) : (
              product.reviews.map((review: any) => (
                <div
                  key={review._id}
                  className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <strong className="text-gray-200 font-bold">
                        {review.name}
                      </strong>
                    </div>
                    <p className="text-gray-500 text-xs font-medium bg-white/5 px-3 py-1 rounded-full">
                      {moment(review.createdAt).format("LL")}
                    </p>
                  </div>

                  <div className="mb-4">
                    <Ratings value={review.rating} />
                  </div>
                  <p className="text-gray-400 leading-relaxed ">
                    "{review.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts
                ?.filter((p) => p._id !== product._id)
                .slice(0, 3)
                .map((item) => (
                  <SmallProduct key={item._id} product={item} />
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
