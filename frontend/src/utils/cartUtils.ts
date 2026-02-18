import type { CartState } from "../types";

export const addDecimals = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state: CartState): CartState => {
  // Calculate items price
  const itemsPriceRaw = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  state.itemsPrice = addDecimals(itemsPriceRaw);

  // Calculate shipping price (If order is over $100 then free, else $10 shipping)
  const shippingPriceRaw = itemsPriceRaw > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPriceRaw);

  // Calculate tax price (15% tax)
  const taxPriceRaw = 0.15 * itemsPriceRaw;
  state.taxPrice = addDecimals(taxPriceRaw);

  // Calculate total price
  const totalPriceRaw = itemsPriceRaw + shippingPriceRaw + taxPriceRaw;
  state.totalPrice = addDecimals(totalPriceRaw);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
