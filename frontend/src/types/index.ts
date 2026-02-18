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
