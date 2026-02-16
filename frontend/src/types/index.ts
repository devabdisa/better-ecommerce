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

/** Auth slice state shape */
export interface AuthState {
  userInfo: UserInfo | null;
}

/** Root Redux state – mirrors configureStore reducer map */
export interface RootState {
  auth: AuthState;
  // RTK Query api reducer is handled dynamically via apiSlice.reducerPath
  [key: string]: unknown;
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
