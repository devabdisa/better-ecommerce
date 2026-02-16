import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import type { FC } from "react";

const AdminMenu: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-primary-dark p-3 fixed rounded-full z-2000 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 text-white`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes className="text-white" size={20} />
        ) : (
          <div className="flex flex-col space-y-1">
            <div className="w-5 h-0.5 bg-white rounded-full"></div>
            <div className="w-5 h-0.5 bg-white rounded-full"></div>
            <div className="w-5 h-0.5 bg-white rounded-full"></div>
          </div>
        )}
      </button>

      {isMenuOpen && (
        <section className="bg-surface p-6 fixed right-0 top-0 w-80 min-h-screen z-1900 shadow-2xl glass border-l border-gray-800 transition-transform duration-300 animate-slide-in-right">
          <div className="mt-16">
            <ul className="list-none space-y-3">
              {[
                { name: "Admin Dashboard", path: "/admin/dashboard" },
                { name: "Create Category", path: "/admin/categorylist" },
                { name: "Create Product", path: "/admin/productlist" },
                { name: "All Products", path: "/admin/allproductslist" },
                { name: "Manage Users", path: "/admin/userlist" },
                { name: "Manage Orders", path: "/admin/orderlist" },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/50"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                    to={item.path}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
