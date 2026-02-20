import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import type { FC } from "react";
import { FaBox, FaChevronRight, FaArrowLeft } from "react-icons/fa";

const UserOrder: FC = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 pt-24 lg:ml-[8%] transition-all duration-300 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors font-bold uppercase tracking-wider text-[10px] mb-10 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <div className="px-4 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-fit">
              Order History
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              My <span className="text-primary ">Orders</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-surface/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                Total Orders
              </span>
              <span className="text-white font-bold">
                {orders?.length || 0} Shipments
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FaBox size={18} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="error">
            {(error as any)?.data?.message || "Failed to load orders"}
          </Message>
        ) : !orders || orders.length === 0 ? (
          <div className="glass-card rounded-4xl p-20 text-center border-white/5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-gray-600">
              <FaBox size={30} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No active orders
            </h3>
            <p className="text-text-muted font-bold uppercase tracking-widest text-[10px]">
              You haven't placed any orders yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-8 px-10 py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transform transition-all hover:bg-primary-dark shadow-lg shadow-primary/20"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto glass-card rounded-4xl border-white/5 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2">
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Order ID
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Date
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Total
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Payment
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/3 transition-colors group"
                  >
                    <td className="p-6 font-bold text-white tracking-tight">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-6 text-sm font-medium text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-xl font-bold text-white tracking-tight">
                      ${order.totalPrice.toFixed(2)}
                    </td>

                    <td className="p-6">
                      {order.isPaid ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                          Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-500 uppercase tracking-widest">
                          Unpaid
                        </span>
                      )}
                    </td>

                    <td className="p-6">
                      {order.isDelivered ? (
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                          Delivered
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-bold text-yellow-500 uppercase tracking-widest">
                          Shipped
                        </span>
                      )}
                    </td>

                    <td className="p-6 text-center">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:scale-105"
                      >
                        <FaChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
