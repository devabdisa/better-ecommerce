import { useState } from "react";
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
import FavoritesCount from "../Products/FavoritesCount";

const Navigation: FC = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

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

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-surface border-r border-gray-800 w-[4%] hover:w-[15%] h-screen fixed transition-all duration-300 ease-in-out shadow-xl group`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
        >
          <AiOutlineHome className="shrink-0 mr-2 mt-12" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium tracking-wide">
            HOME
          </span>
        </Link>

        {/* ... (Other links follow similar pattern) */}

        {/* <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
        >
          <AiOutlineShopping className="shrink-0 mr-2 mt-12" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium tracking-wide">
            SHOP
          </span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2 p-2 rounded-lg hover:bg-white/5 relative"
        >
          <AiOutlineShoppingCart className="shrink-0 mt-12 mr-2" size={26} />
          <span className="hidden nav-item-name mt-12 font-medium tracking-wide">
            CART
          </span>
        </Link> */}

        <Link
          to="/favorite"
          className="flex items-center transition-transform transform hover:translate-x-2 p-2 rounded-lg hover:bg-white/5 relative"
        >
          <div className="flex items-center relative">
            <FaHeart className="shrink-0 mt-12 mr-2 text-sky-500" size={20} />
            <FavoritesCount />
          </div>
          <span className="hidden nav-item-name mt-12 font-medium tracking-wide">
            FAVORITES
          </span>
        </Link>
      </div>

      <div className="relative mb-5">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none w-full p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {userInfo ? (
            <div className="flex items-center w-full">
              {/* User Avatar Placeholder */}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2 shrink-0 ring-2 ring-blue-400/30">
                {userInfo.username.substring(0, 1).toUpperCase()}
              </div>
              <span className="text-white hidden nav-item-name font-medium truncate ml-1">
                {userInfo.username}
              </span>
            </div>
          ) : (
            <></>
          )}

          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-auto text-gray-400 hidden nav-item-name ${
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
          <ul
            className={`absolute bottom-full left-0 w-full mb-2 bg-surface text-gray-200 border border-gray-700 rounded-lg shadow-2xl overflow-hidden glass z-50 transition-all duration-200 ease-out transform origin-bottom`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-red-600 hover:text-white transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
              >
                <AiOutlineLogin className="mr-2 mt-4 shrink-0" size={26} />
                <span className="hidden nav-item-name mt-4 font-medium tracking-wide">
                  LOGIN
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2 p-2 rounded-lg hover:bg-white/5"
              >
                <AiOutlineUserAdd size={26} className="mr-2 mt-4 shrink-0" />
                <span className="hidden nav-item-name mt-4 font-medium tracking-wide">
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
