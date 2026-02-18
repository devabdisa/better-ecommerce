import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import type { Product } from "../../types";
import type { FC } from "react";

const AllProducts: FC = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen ml-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="ml-20 text-white p-8">Error loading products</div>;
  }

  return (
    <>
      <div className="ml-20 flex flex-col md:flex-row min-h-screen bg-background text-white">
        <AdminMenu />

        <div className="w-full p-8">
          <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-700 pb-4">
            All Products ({products?.length})
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product: Product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block rounded-lg overflow-hidden glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-500/50 border border-transparent"
              >
                <div className="relative overflow-hidden w-full h-50 border-b border-gray-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {moment(product.createdAt).format("MMM Do")}
                  </div>
                </div>

                <div className="p-4 flex flex-col h-45">
                  <div className="flex justify-between items-start mb-2">
                    <h5
                      className="text-lg font-bold text-gray-100 line-clamp-1 flex-1 mr-2"
                      title={product.name}
                    >
                      {product.name}
                    </h5>
                    <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                      ${product.price}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 grow">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 w-full justify-center transition-colors">
                      Update Product
                      <svg
                        className="w-3.5 h-3.5 ml-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
