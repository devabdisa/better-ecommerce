import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import type { ApiError, CartItem } from "../../types";
import {
  FaBoxOpen,
  FaMapMarkedAlt,
  FaWallet,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

const PlaceOrder: FC = () => {
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useAppDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map((item: CartItem) => ({
          _id: item._id,
          qty: item.qty,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError?.data?.message ?? "Failed to place order");
    }
  };

  const apiError = error as ApiError | undefined;

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 pt-24 lg:ml-[8%] transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/shipping"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors font-bold uppercase tracking-wider text-[10px] mb-10 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Edit Shipping Info
        </Link>

        <ProgressSteps step1 step2 step3 />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Left column: Order Items & Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Delivery Summary */}
            <div className="glass-card rounded-4xl p-8 md:p-10 border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <FaMapMarkedAlt size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Delivery Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                    Shipping Address
                  </span>
                  <p className="text-lg font-medium text-white leading-relaxed">
                    {cart.shippingAddress.address}
                    <br />
                    {cart.shippingAddress.city},{" "}
                    {cart.shippingAddress.postalCode}
                    <br />
                    <span className="text-primary font-bold">
                      {cart.shippingAddress.country}
                    </span>
                  </p>
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                    Payment Method
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-3">
                      <FaWallet className="text-primary" />
                      {cart.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Review */}
            <div className="glass-card rounded-4xl p-8 md:p-10 border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <FaBoxOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Order Items
                </h2>
              </div>

              {cart.cartItems.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-text-muted font-medium">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item: CartItem, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-lg font-bold text-white hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest mt-1">
                          Price:{" "}
                          <span className="text-white ">
                            ${item.price.toFixed(2)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          QTY:{" "}
                          <span className="text-white text-base">
                            {item.qty}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white tracking-tight">
                          ${(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Sticky Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 glass-card rounded-4xl p-8 border-white/5 shadow-2xl overflow-hidden">
              <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-white">
                    ${cart.itemsPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Shipping
                  </span>
                  <span className="text-lg font-bold text-white">
                    ${cart.shippingPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Estimated Tax
                  </span>
                  <span className="text-lg font-bold text-white">
                    ${cart.taxPrice}
                  </span>
                </div>
                <div className="h-px bg-white/5 my-4 mx-2" />
                <div className="flex justify-between items-center p-6 bg-primary/5 rounded-2xl border border-primary/20 shadow-inner">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-white tracking-tight">
                    ${cart.totalPrice}
                  </span>
                </div>
              </div>

              {apiError && (
                <div className="mb-6">
                  <Message variant="error">
                    {apiError.data?.message ??
                      "An error occurred while placing order"}
                  </Message>
                </div>
              )}

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    Confirm Order
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-[9px] text-text-muted font-medium uppercase tracking-widest text-center mt-6 px-4">
                By placing the order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
