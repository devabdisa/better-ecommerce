import { PRODUCT_URL, UPLOAD_URL, BASE_URL } from "../constants";
import { apiSlice } from "./apiSlice";
import type { Product, ProductsResponse } from "../../types";

const transformProductImage = (product: Product): Product => {
  if (!product.image) return product;
  return {
    ...product,
    image: product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`,
  };
};

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, { keyword: string }>({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
      transformResponse: (response: ProductsResponse) => ({
        ...response,
        products: response.products.map(transformProductImage),
      }),
    }),

    getProductById: builder.query<Product, string>({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      transformResponse: (response: Product) => transformProductImage(response),
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query<Product[], void>({
      query: () => `${PRODUCT_URL}/allProducts`,
      transformResponse: (response: Product[]) =>
        response.map(transformProductImage),
      providesTags: ["Product"],
    }),

    getProductDetails: builder.query<Product, string>({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      transformResponse: (response: Product) => transformProductImage(response),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation<Product, FormData>({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<
      Product,
      { productId: string; formData: FormData }
    >({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    uploadProductImage: builder.mutation<
      { message: string; image: string },
      FormData
    >({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { message: string; image: string }) => ({
        ...response,
        image: response.image.startsWith("http")
          ? response.image
          : `${BASE_URL}${response.image}`,
      }),
    }),

    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    createReview: builder.mutation<
      void,
      { productId: string; rating: number; comment: string }
    >({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    getTopProducts: builder.query<Product[], void>({
      query: () => `${PRODUCT_URL}/top`,
      transformResponse: (response: Product[]) =>
        response.map(transformProductImage),
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query<Product[], void>({
      query: () => `${PRODUCT_URL}/new`,
      transformResponse: (response: Product[]) =>
        response.map(transformProductImage),
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query<
      Product[],
      { checked: string[]; radio: number[] }
    >({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
      transformResponse: (response: Product[]) =>
        response.map(transformProductImage),
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
