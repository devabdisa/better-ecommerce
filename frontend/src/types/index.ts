// ==========================================
// Shared TypeScript types for the frontend
// ==========================================
/** Auth slice state shape */
export interface AuthState {
  userInfo: UserInfo | null;
}

/** Shipping Address shape */
export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

/** Cart Item shape (Product + qty) */
export interface CartItem extends Omit<
  Product,
  "reviews" | "numReviews" | "rating"
> {
  qty: number;
}

/** Cart State shape */
export interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
}

/** Shop State shape */
export interface ShopState {
  categories: Category[];
  products: Product[];
  checked: string[];
  radio: number[];
  brandCheckboxes: Record<string, boolean>;
  checkedBrands: string[];
  selectedBrand?: string;
}

/** Root Redux state – mirrors configureStore reducer map */
export interface RootState {
  auth: AuthState;
  favorites: Product[];
  cart: CartState;
  shop: ShopState;
  // RTK Query api reducer is handled dynamically via apiSlice.reducerPath
  [key: string]: unknown;
}

// ==========================================
// Shared TypeScript types for the frontend
// ==========================================

/** Represents a user returned from the API */
export interface UserInfo {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

/** Represents a create category request */
export interface CreateCategoryRequest {
  name: string;
}

/** Represents a category returned from the API */
export interface Category {
  _id: string;
  name: string;
}

/** Represents an update category request */
export interface UpdateCategoryRequest {
  categoryId: string;
  updatedCategory: {
    name: string;
  };
}

/** Product interface */
export interface Product {
  error: any;
  _id: string;
  name: string;
  image: string;
  brand: string;
  quantity: number;
  category: any;
  description: string;
  reviews: any[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  hasMore: boolean;
}

// ---- API request / response types ----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  userId: string;
  username: string;
  email: string;
}

/** Shape of an API error returned by the backend */
export interface ApiError {
  data?: {
    message?: string;
  };
  error?: string;
}

/** Variant options for the Message component */
export type MessageVariant = "success" | "error" | "info";

// ==========================================
// Order-related types
// ==========================================

/** A single item inside an order */
export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string; // product _id reference
}

/** Chapa payment result stored on the order */
export interface PaymentResult {
  tx_ref: string;
  chapa_ref: string;
  status: string;
  payment_method: string;
  paid_at: string;
}

/** Populated user inside an order response */
export interface OrderUser {
  _id: string;
  username: string;
  email: string;
}

/** Full order object returned from the API */
export interface Order {
  _id: string;
  user: OrderUser;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  chapaTxRef?: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Body sent when creating a new order */
export interface CreateOrderRequest {
  orderItems: { _id: string; qty: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: string | number;
  shippingPrice: string | number;
  taxPrice: string | number;
  totalPrice: string | number;
}

/** Response from Chapa payment initialization */
export interface ChapaInitResponse {
  message: string;
  checkout_url: string;
  tx_ref: string;
}

/** Request body for initializing Chapa payment */
export interface ChapaInitRequest {
  orderId: string;
  return_url?: string;
}

/** Response from Chapa payment verification */
export interface ChapaVerifyResponse {
  message: string;
  isPaid: boolean;
  status?: string;
  order?: Order;
}

/** /total-orders response */
export interface TotalOrdersResponse {
  totalOrders: number;
}

/** /total-sales response */
export interface TotalSalesResponse {
  totalSales: number;
}

/** Single entry from /total-sales-by-date */
export interface SalesByDateItem {
  _id: string; // date string, e.g. "2026-02-20"
  totalSales: number;
}
