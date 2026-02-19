import { useEffect, useRef, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import type { FC } from "react";

const Navigation: FC = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const { cartItems } = useAppSelector((state) => state.cart) || {
    cartItems: [],
  };
  const favorites = useAppSelector((state) => state.favorites) || [];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#0f0f10] border-r border-[#27272a] w-[6%] hover:w-[15%] h-screen fixed transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.5)] group z-50`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4 pt-4">
        <Link
          to="/"
          className="flex items-center transition-all transform hover:translate-x-2 p-3 rounded-xl hover:bg-[#27272a] group/item"
        >
          <AiOutlineHome
            className="shrink-0 mr-2 text-gray-400 group-hover/item:text-white transition-colors"
            size={26}
          />
          <span className="hidden nav-item-name font-medium tracking-wide text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            HOME
          </span>
        </Link>

        {/* ... (Other links follow similar pattern) */}

        <Link
          to="/shop"
          className="flex items-center transition-all transform hover:translate-x-2 p-3 rounded-xl hover:bg-[#27272a] group/item"
        >
          <AiOutlineShopping
            className="shrink-0 mr-2 text-gray-400 group-hover/item:text-white transition-colors"
            size={26}
          />
          <span className="hidden nav-item-name font-medium tracking-wide text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            SHOP
          </span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-all transform hover:translate-x-2 p-3 rounded-xl hover:bg-[#27272a] group/item relative"
        >
          <div className="relative">
            <AiOutlineShoppingCart
              className="shrink-0 mr-2 text-gray-400 group-hover/item:text-white transition-colors"
              size={26}
            />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -left-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-full border border-[#0f0f10] shadow-sm">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </div>
          <span className="hidden nav-item-name font-medium tracking-wide text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            CART
          </span>
        </Link>

        <Link
          to="/favorite"
          className="flex items-center transition-all transform hover:translate-x-2 p-3 rounded-xl hover:bg-[#27272a] group/item relative"
        >
          <div className="flex items-center relative">
            <FaHeart
              className="shrink-0 mr-2 text-gray-400 group-hover/item:text-pink-500 transition-colors"
              size={24}
            />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -left-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-pink-500 rounded-full border border-[#0f0f10] shadow-sm">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="hidden nav-item-name font-medium tracking-wide text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            FAVORITES
          </span>
        </Link>
      </div>

      <div className="relative mb-5" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none w-full p-2 rounded-xl hover:bg-[#27272a] transition-all"
        >
          {userInfo ? (
            <div className="flex items-center w-full">
              {/* User Avatar Placeholder */}
              <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold mr-2 shrink-0 border border-white/10 shadow-lg">
                {userInfo.username.substring(0, 1).toUpperCase()}
              </div>
              <span className="text-white hidden nav-item-name font-medium truncate ml-1 text-sm">
                {userInfo.username}
              </span>
            </div>
          ) : (
            <></>
          )}

          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-auto text-gray-400 hidden nav-item-name transition-transform duration-200 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <div
            className={`absolute bottom-full left-0 w-60 ml-2 mb-4 bg-[#18181b] text-gray-200 border border-[#27272a] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            {userInfo.isAdmin && (
              <div className="p-2 border-b border-[#27272a]">
                <span className="text-xs font-bold text-gray-500 px-3 py-1 block uppercase tracking-wider">
                  Admin
                </span>
                <Link
                  to="/admin/dashboard"
                  className="block px-3 py-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/productlist"
                  className="block px-3 py-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/admin/categorylist"
                  className="block px-3 py-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  to="/admin/orderlist"
                  className="block px-3 py-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-sm font-medium"
                >
                  Orders
                </Link>
                <Link
                  to="/admin/userlist"
                  className="block px-3 py-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-sm font-medium"
                >
                  Users
                </Link>
              </div>
            )}

            <div className="p-2">
              <span className="text-xs font-bold text-gray-500 px-3 py-1 block uppercase tracking-wider">
                Account
              </span>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-lg hover:bg-[#27272a] transition-colors text-sm font-medium"
              >
                Profile
              </Link>
              <button
                onClick={logoutHandler}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        {!userInfo && (
          <ul className="space-y-2">
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2 p-2 rounded-xl hover:bg-white/5 group/item"
              >
                <AiOutlineLogin
                  className="mr-2 shrink-0 text-gray-400 group-hover/item:text-white"
                  size={26}
                />
                <span className="hidden nav-item-name font-medium tracking-wide text-sm whitespace-nowrap">
                  LOGIN
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-2 transition-transform transform hover:translate-x-2 p-2 rounded-xl hover:bg-white/5 group/item"
              >
                <AiOutlineUserAdd
                  size={26}
                  className="mr-2 shrink-0 text-gray-400 group-hover/item:text-white"
                />
                <span className="hidden nav-item-name font-medium tracking-wide text-sm whitespace-nowrap">
                  REGISTER
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
