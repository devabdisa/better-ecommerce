import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ShopState, Category, Product } from "../../../types";

const initialState: ShopState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  brandCheckboxes: {},
  checkedBrands: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload;
    },
    setRadio: (state, action: PayloadAction<number[]>) => {
      state.radio = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string>) => {
      state.selectedBrand = action.payload;
    },
    setBrandCheckboxes: (
      state,
      action: PayloadAction<Record<string, boolean>>,
    ) => {
      state.brandCheckboxes = action.payload;
    },
    setCheckedBrands: (state, action: PayloadAction<string[]>) => {
      state.checkedBrands = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
  setBrandCheckboxes,
  setCheckedBrands,
} = shopSlice.actions;

export default shopSlice.reducer;
