import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, RootState } from "../../../types";

const initialState: Product[] = [];

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Product>) => {
      // Check if the product is not already favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<{ _id: string }>) => {
      // Remove the product with the matching ID
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (_state, action: PayloadAction<Product[]>) => {
      // Set the favorites from localStorage
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;

export const selectFavoriteProduct = (state: RootState) => state.favorites;

export default favoriteSlice.reducer;
