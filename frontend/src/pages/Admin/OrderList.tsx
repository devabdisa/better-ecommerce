import { Link, useNavigate } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import type { FC } from "react";
import {
  FaClipboardList,
  FaUsers,
  FaArrowRight,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";
import AdminMenu from "./AdminMenu";

const OrderList: FC = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 pt-24 md:ml-[5%] lg:ml-[8%] transition-all duration-300 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <AdminMenu />

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors font-bold uppercase tracking-wider text-[10px] mb-10 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <div className="px-4 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-fit">
              Order Management
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              All <span className="text-primary ">Orders</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-surface/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                Total Orders
              </span>
              <span className="text-white font-bold">
                {orders?.length || 0} Records
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FaClipboardList size={18} />
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
        ) : (
          <div className="overflow-x-auto glass-card rounded-[2rem] border-white/5 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Order Details
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Total Price
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Payment Status
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Shipping Status
                  </th>
                  <th className="p-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders?.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="space-y-1">
                        <span className="font-bold text-white tracking-tight block">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-text-muted uppercase tracking-wider">
                          <FaUsers className="text-primary" size={10} />
                          {order.user ? (
                            order.user.username
                          ) : (
                            <span className="text-red-500 ">
                              Deleted User
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-text-muted">
                          <FaClock size={10} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <span className="text-xl font-bold text-white tracking-tight block">
                        ${order.totalPrice.toFixed(2)}
                      </span>
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
                          In Transit
                        </span>
                      )}
                    </td>

                    <td className="p-6 text-center">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-dark transition-all"
                      >
                        View
                        <FaArrowRight className="text-[12px]" />
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

export default OrderList;
