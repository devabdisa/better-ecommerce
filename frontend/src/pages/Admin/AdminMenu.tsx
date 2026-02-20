import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTimes,
  FaChartBar,
  FaTags,
  FaBoxOpen,
  FaBoxes,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
import type { FC } from "react";

const AdminMenu: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaChartBar },
    { name: "Categories", path: "/admin/categorylist", icon: FaTags },
    { name: "Create Product", path: "/admin/productlist", icon: FaBoxOpen },
    { name: "Product Catalog", path: "/admin/allproductslist", icon: FaBoxes },
    { name: "User Management", path: "/admin/userlist", icon: FaUsers },
    {
      name: "Order Analytics",
      path: "/admin/orderlist",
      icon: FaClipboardList,
    },
  ];

  return (
    <>
      <button
        className={`fixed top-5 right-10 z-[2001] w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-2xl ${
          isMenuOpen
            ? "bg-red-500 text-white rotate-90"
            : "bg-primary text-white"
        }`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes size={24} />
        ) : (
          <div className="flex flex-col space-y-1.5 p-1">
            <div className="w-6 h-0.5 bg-white rounded-full"></div>
            <div className="w-4 h-0.5 bg-white rounded-full self-end"></div>
            <div className="w-6 h-0.5 bg-white rounded-full"></div>
          </div>
        )}
      </button>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1999] transition-opacity duration-500"
          onClick={toggleMenu}
        />
      )}

      <section
        className={`fixed right-0 top-0 w-[350px] min-h-screen bg-[#0d0d0f]/95 backdrop-blur-2xl z-[2000] border-l border-white/5 transition-all duration-700 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-10 pt-24 h-full flex flex-col justify-between">
          <div className="space-y-10">
            <div className="space-y-2">
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] block">
                Administration
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight ">
                Control Center
              </h2>
            </div>

            <nav>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 group ${
                          isActive
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "text-text-muted hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <item.icon
                        className={`transition-transform duration-500 group-hover:scale-125`}
                        size={16}
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 text-center space-y-4">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
              Logged as Administrator
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto text-primary font-black text-xl">
              A
            </div>
            <button className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">
              Secure Sign Out
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminMenu;
