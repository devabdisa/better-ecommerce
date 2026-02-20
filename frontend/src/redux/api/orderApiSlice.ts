import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";
import type {
  Order,
  CreateOrderRequest,
  ChapaInitResponse,
  ChapaInitRequest,
  ChapaVerifyResponse,
  TotalOrdersResponse,
  TotalSalesResponse,
  SalesByDateItem,
} from "../../types";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query<Order, string | undefined>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    // Initialize Chapa payment — returns checkout_url for redirect
    initializeChapaPayment: builder.mutation<
      ChapaInitResponse,
      ChapaInitRequest
    >({
      query: ({ orderId, return_url }) => ({
        url: `${ORDERS_URL}/${orderId}/pay/chapa`,
        method: "POST",
        body: { return_url },
      }),
    }),

    // Verify Chapa payment — called after user returns from checkout
    verifyChapaPayment: builder.query<ChapaVerifyResponse, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/verify-payment`,
      }),
    }),

    getMyOrders: builder.query<Order[], void>({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),

    deliverOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query<TotalOrdersResponse, void>({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query<TotalSalesResponse, void>({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query<SalesByDateItem[], void>({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useInitializeChapaPaymentMutation,
  useLazyVerifyChapaPaymentQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
