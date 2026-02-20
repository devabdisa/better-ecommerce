import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { FC } from "react";
import { useAppSelector } from "../../redux/hooks";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useInitializeChapaPaymentMutation,
  useLazyVerifyChapaPaymentQuery,
} from "../../redux/api/orderApiSlice";
import type { ApiError } from "../../types";
import {
  FaTag,
  FaUserCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShippingFast,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaMoneyBillWave,
  FaSpinner,
} from "react-icons/fa";
import { resolveImageUrl } from "../../utils/imageUrl";

const Order: FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [initializeChapaPayment, { isLoading: loadingChapa }] =
    useInitializeChapaPaymentMutation();

  const [triggerVerify, { isLoading: loadingVerify }] =
    useLazyVerifyChapaPaymentQuery();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useAppSelector(
    (state: { auth: { userInfo: any } }) => state.auth,
  );

  const [verifyAttempted, setVerifyAttempted] = useState(false);

  // Auto-verify payment when user returns from Chapa checkout
  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !order || order.isPaid || verifyAttempted) return;

      // If a chapaTxRef exists but order isn't paid, try to verify
      if (order.chapaTxRef) {
        setVerifyAttempted(true);
        try {
          const result = await triggerVerify(orderId).unwrap();
          if (result.isPaid) {
            toast.success("Payment verified successfully!");
            refetch();
          } else if (result.status === "pending") {
            toast.info("Payment is being processed. Please wait...");
          }
        } catch (err) {
          console.error("Auto-verification failed:", err);
        }
      }
    };

    verifyPayment();
  }, [orderId, order, triggerVerify, refetch, verifyAttempted]);

  const handleChapaPayment = async () => {
    if (!orderId) return;
    try {
      const returnUrl = `${window.location.origin}/order/${orderId}`;
      const result = await initializeChapaPayment({
        orderId,
        return_url: returnUrl,
      }).unwrap();

      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        toast.error("Failed to get checkout URL");
      }
    } catch (err: any) {
      const message =
        err?.data?.message || err?.error || "Payment initialization failed";
      console.error("Chapa payment error:", err);
      toast.error(message);
    }
  };

  const handleVerifyPayment = async () => {
    if (!orderId) return;
    try {
      const result = await triggerVerify(orderId).unwrap();
      if (result.isPaid) {
        toast.success("Payment verified successfully!");
        refetch();
      } else if (result.status === "pending") {
        toast.info(
          "Payment is still being processed. Please try again in a moment.",
        );
      } else {
        toast.error("Payment was not successful. Please try again.");
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError?.data?.message ?? "Verification failed");
    }
  };

  const deliverHandler = async () => {
    if (!orderId) return;
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Logistics Optimized: Delivered");
    } catch (err: any) {
      toast.error(err?.data?.message || "Logistics Conflict");
    }
  };

  const queryError = error as ApiError | undefined;

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 pt-24 md:ml-[5%] lg:ml-[8%] transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black uppercase tracking-widest text-xs mb-10 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Previous Coordinates
        </button>

        {isLoading ? (
          <Loader />
        ) : queryError ? (
          <div className="p-10">
            <Message variant="error">
              {queryError.data?.message ?? "Order data inaccessible"}
            </Message>
          </div>
        ) : !order ? null : (
          <>
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-blue-500 uppercase tracking-[0.2em] ">
                    Manifest #{order._id.slice(-8).toUpperCase()}
                  </div>
                  {order.isPaid ? (
                    <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                      <FaCheckCircle /> SECURE - PAID
                    </div>
                  ) : (
                    <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                      <FaExclamationCircle /> ACTION REQUIRED - UNPAID
                    </div>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white  tracking-tighter uppercase mt-4">
                  Order <span className="text-blue-500 ">Tracking</span>
                </h1>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                    Digital Method
                  </span>
                  <span className="text-white font-bold ">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <FaMoneyBillWave size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Side: Details */}
              <div className="lg:col-span-8 space-y-10">
                {/* Customer & Shipping Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card rounded-[2.5rem] p-8 border-white/5 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                      <FaUserCircle size={24} />
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">
                        Customer
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <FaTag className="text-gray-500 mt-1" size={14} />
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                            Name
                          </span>
                          <span className="text-white font-bold ">
                            {order.user.username}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <FaEnvelope className="text-gray-500 mt-1" size={14} />
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                            Email
                          </span>
                          <span className="text-white font-bold ">
                            {order.user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-8 border-white/5 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 text-purple-500 mb-2">
                      <FaShippingFast size={24} />
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">
                        Shipping
                      </h3>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex gap-3 text-gray-400">
                        <FaMapMarkerAlt className="shrink-0 mt-1" size={14} />
                        <p className="text-white font-bold  leading-relaxed">
                          {order.shippingAddress.address}
                          <br />
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.postalCode}
                          <br />
                          <span className="text-purple-500">
                            {order.shippingAddress.country}
                          </span>
                        </p>
                      </div>
                      <div className="h-px bg-white/5 my-2" />
                      {order.isDelivered ? (
                        <div className="p-3 bg-green-500/10 rounded-xl text-center">
                          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest block">
                            Logistics Finalized
                          </span>
                          <span className="text-xs text-white font-bold ">
                            {new Date(order.deliveredAt!).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-500/10 rounded-xl text-center">
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">
                            In Transit / Pending
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="glass-card rounded-[2.5rem] p-8 border-white/5 shadow-2xl overflow-hidden">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-8 ">
                    Product Breakdown
                  </h3>
                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-3xl group"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                          <img
                            src={resolveImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-xl font-black text-white hover:text-blue-400 transition-colors  line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <div className="flex justify-center sm:justify-start gap-4 mt-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              UNIT:{" "}
                              <span className="text-white">${item.price}</span>
                            </span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              QTY:{" "}
                              <span className="text-white">{item.qty}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-black text-white ">
                          ${(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Summary Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 glass-card rounded-[2.5rem] p-8 border-white/5 shadow-2xl overflow-hidden">
                  <h2 className="text-3xl font-black text-white mb-10  uppercase tracking-tight">
                    Financial{" "}
                    <span className="text-blue-500  block text-lg tracking-[0.3em] font-bold mt-1">
                      Summary
                    </span>
                  </h2>

                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center px-4">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Gross Items
                      </span>
                      <span className="text-xl font-bold text-white  tracking-tight">
                        ${order.itemsPrice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Logistics
                      </span>
                      <span className="text-xl font-bold text-white  tracking-tight">
                        ${order.shippingPrice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Fiscal Tax
                      </span>
                      <span className="text-xl font-bold text-white  tracking-tight">
                        ${order.taxPrice}
                      </span>
                    </div>
                    <div className="h-px bg-white/5 my-4" />
                    <div className="flex justify-between items-center p-6 bg-blue-600/10 rounded-4xl border border-blue-500/20 shadow-inner">
                      <span className="text-sm font-black uppercase tracking-widest text-blue-400">
                        Net Total
                      </span>
                      <span className="text-4xl font-black text-white tracking-tighter ">
                        ${order.totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Chapa Payment Section */}
                  {!order.isPaid && (
                    <div className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-center text-text-muted uppercase tracking-[0.3em]">
                          Secure Authorization
                        </h4>

                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: "Telebirr", color: "bg-[#00adef]" },
                            { name: "CBE Birr", color: "bg-[#7b2cbf]" },
                            { name: "M-Pesa", color: "bg-[#49aa47]" },
                            { name: "Awash", color: "bg-[#ed1c24]" },
                            { name: "Amole", color: "bg-[#f7941d]" },
                            { name: "Cards", color: "bg-primary" },
                          ].map((pm) => (
                            <div
                              key={pm.name}
                              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/3 border border-white/5 group/pm hover:bg-white/6 transition-all"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${pm.color} shadow-[0_0_8px_${pm.color}]`}
                              />
                              <span className="text-[8px] font-bold text-text-muted uppercase tracking-tighter group-hover/pm:text-white transition-colors">
                                {pm.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Pay with Chapa Button */}
                        <button
                          type="button"
                          className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.15em] transform active:scale-[0.98] transition-all hover:bg-green-700 shadow-[0_20px_40px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                          onClick={handleChapaPayment}
                          disabled={loadingChapa}
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                          {loadingChapa ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Initializing...
                            </>
                          ) : (
                            <>
                              <FaMoneyBillWave size={18} />
                              Pay with Chapa
                            </>
                          )}
                        </button>

                        {/* Verify Payment Button */}
                        {order.chapaTxRef && (
                          <div className="space-y-3">
                            <div className="h-px bg-white/5 mx-4" />
                            <button
                              type="button"
                              className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold uppercase tracking-[0.15em] text-xs transition-all hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
                              onClick={handleVerifyPayment}
                              disabled={loadingVerify}
                            >
                              {loadingVerify ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <FaCheckCircle className="text-primary" />
                                  Verify Status
                                </>
                              )}
                            </button>
                            <p className="text-[8px] text-text-muted text-center font-medium leading-relaxed px-4">
                              Already paid? Click verify to update your order
                              status manually if it doesn't happen
                              automatically.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">
                          Encrypted Checkout
                        </span>
                      </div>
                    </div>
                  )}

                  {loadingDeliver && (
                    <div className="mt-4">
                      <Loader />
                    </div>
                  )}
                  {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                    <button
                      type="button"
                      className="w-full bg-green-600 text-white py-6 rounded-4xl font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-green-700 shadow-[0_20px_40px_rgba(34,197,94,0.3)] mt-6 flex items-center justify-center gap-3"
                      onClick={deliverHandler}
                    >
                      <FaShippingFast /> Dispatch Order
                    </button>
                  )}

                  {order.isPaid && (
                    <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-3xl text-center">
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest block mb-1">
                        Authorization Complete
                      </span>
                      <span className="text-xs text-white font-bold ">
                        {new Date(order.paidAt!).toLocaleString()}
                      </span>
                      {order.paymentResult && (
                        <div className="mt-3 space-y-1">
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">
                            via {order.paymentResult.payment_method || "Chapa"}
                          </span>
                          {order.paymentResult.chapa_ref && (
                            <span className="text-[9px] text-gray-600 font-bold block">
                              Ref: {order.paymentResult.chapa_ref}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Order;
