import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartState, CartItem, ShippingAddress } from "../../../types";
import { updateCart } from "../../../utils/cartUtils";

const storedCart = localStorage.getItem("cart");

const initialState: CartState = storedCart
  ? JSON.parse(storedCart)
  : {
      cartItems: [],
      shippingAddress: { address: "", city: "", postalCode: "", country: "" },
      paymentMethod: "Chapa",
      itemsPrice: "0.00",
      shippingPrice: "0.00",
      taxPrice: "0.00",
      totalPrice: "0.00",
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {
        address: "",
        city: "",
        postalCode: "",
        country: "",
      };
      state.paymentMethod = "Chapa";
      state.itemsPrice = "0.00";
      state.shippingPrice = "0.00";
      state.taxPrice = "0.00";
      state.totalPrice = "0.00";
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
