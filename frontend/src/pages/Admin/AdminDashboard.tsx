import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect, FC } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import {
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

interface ChartState {
  options: {
    chart: {
      type: "line" | "bar" | "area";
      toolbar: {
        show: boolean;
      };
      background: string;
    };
    [key: string]: any;
  };
  series: {
    name: string;
    data: number[];
  }[];
}

const AdminDashboard: FC = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState<ChartState>({
    options: {
      chart: {
        type: "area",
        toolbar: {
          show: false,
        },
        background: "transparent",
      },
      tooltip: {
        theme: "dark",
        x: {
          show: true,
        },
      },
      colors: ["#3B82F6"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: "rgba(255, 255, 255, 0.05)",
        strokeDashArray: 4,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "10px",
            fontWeight: 600,
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "10px",
            fontWeight: 600,
          },
        },
      },
      theme: {
        mode: "dark",
      },
    },
    series: [{ name: "Revenue", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Revenue", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  const stats = [
    {
      label: "Total Revenue",
      value: sales ? `$${sales.totalSales.toFixed(2)}` : "$0.00",
      icon: FaDollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
      isLoading: isLoading,
    },
    {
      label: "Total Customers",
      value: customers?.length || 0,
      icon: FaUsers,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      isLoading: loadingCustomers,
    },
    {
      label: "Total Orders",
      value: orders?.totalOrders || 0,
      icon: FaShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      isLoading: loadingOrders,
    },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 pt-24 lg:ml-[8%] transition-all duration-300 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <AdminMenu />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <div className="px-4 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-fit">
              Analytics Overview
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Command <span className="text-primary ">Center</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live System Status: Optimal
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card rounded-4xl p-8 border-white/5 shadow-2xl relative overflow-hidden group hover:bg-white/3 transition-all duration-500"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    {stat.label}
                  </span>
                  <div className="text-3xl font-black tracking-tight ">
                    {stat.isLoading ? (
                      <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
                    ) : (
                      stat.value
                    )}
                  </div>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
                >
                  <stat.icon size={24} />
                </div>
              </div>

              {/* Decorative Background Icon */}
              <stat.icon
                size={120}
                className={`absolute -bottom-10 -right-10 opacity-[0.03] ${stat.color} transform rotate-12 group-hover:rotate-0 transition-transform duration-1000`}
              />
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="glass-card rounded-[2.5rem] p-10 border-white/5 shadow-2xl mb-12 overflow-hidden relative">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FaChartLine size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Revenue Analytics
                </h2>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                  Financial Performance Over Time
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {["Daily", "Weekly", "Monthly"].map((period) => (
                <button
                  key={period}
                  className={`px-4 py-2 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${period === "Daily" ? "bg-primary text-white" : "bg-white/5 text-text-muted hover:bg-white/10"}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-100 w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <Chart
                options={state.options}
                series={state.series}
                type="area"
                height="100%"
                width="100%"
              />
            )}
          </div>
        </div>

        {/* Latest Activity / Order List Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.3em]">
              Recent Transactions
            </h2>
          </div>
          <div className="glass-card rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden">
            <OrderList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

