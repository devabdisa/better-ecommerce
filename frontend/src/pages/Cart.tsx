import React, { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import type { RootState, CartItem } from "../types";
import Meta from "../components/Meta";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems } = cart || { cartItems: [] };

  const addToCartHandler = (product: CartItem, qty: number): void => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id: string): void => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Meta title="Shopping Cart | Better Store" />
      <div className="max-w-350 mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-in fade-in slide-in-from-left duration-700">
              Your Selection
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom duration-1000">
              Shopping Cart
            </h1>
          </div>
          <span className="text-sm font-bold text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest relative z-10">
            {cartItems.reduce((acc, item) => acc + item.qty, 0)} Items
          </span>
          <div className="absolute -bottom-px left-0 w-32 h-1 bg-linear-to-r from-blue-600 to-transparent"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-50 space-y-6">
            <div className="p-8 rounded-full bg-white/5 border border-white/10 relative group">
              <FaShoppingCart className="w-16 h-16 text-gray-600 transition-colors group-hover:text-blue-500" />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl -z-10" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                Your Cart is Empty
              </p>
              <Link
                to="/shop"
                className="text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest text-xs border-b border-blue-500/30 pb-1"
              >
                Go To Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3 space-y-6">
              {cartItems.map((item: CartItem) => (
                <div
                  key={item._id}
                  className="flex items-center gap-6 p-6 bg-[#131316] rounded-4xl border border-white/5 hover:border-blue-500/20 transition-all duration-300 group"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-white/5 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded border border-white/5">
                        {item.brand}
                      </span>
                    </div>

                    <p className="text-blue-400 font-black text-2xl mb-4">
                      $ {item.price}
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <select
                          className="p-2 w-24 pl-4 pr-8 bg-black/40 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 text-center font-bold appearance-none cursor-pointer"
                          value={item.qty}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                          <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <button
                        className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full"
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-1/3">
              <div className="bg-[#131316] p-8 rounded-[2.5rem] border border-white/5 sticky top-24">
                <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>
                      Items (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </span>
                    <span className="text-white font-bold">
                      ${" "}
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400 font-bold text-xs uppercase bg-green-400/10 px-2 py-1 rounded">
                      Free
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 pt-6 border-t border-white/10">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-3xl font-black text-blue-400">
                    ${" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <button
                  className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-blue-500/20 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
