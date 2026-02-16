import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import type { FormEvent, FC } from "react";
import type { ApiError } from "../../types";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Login successful");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.data?.message || error.error || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white">
      <section className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4">
        {/* Login Form Section */}
        <div className="md:w-1/2 w-full p-8 md:p-12 glass rounded-2xl md:rounded-r-none z-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Sign In</h1>
          <p className="text-gray-400 mb-8">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={submitHandler} className="w-full">
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-lg bg-surface border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 rounded-lg bg-surface border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-sky-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && (
              <div className="mt-4">
                <Loader />
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Image Section - styled to look premium */}
        <div className=" md:w-1/2 w-full hidden md:block h-150 relative">
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Shopping"
            className="h-full w-full object-cover rounded-2xl md:rounded-l-none shadow-2xl opacity-90"
          />
          <div className="absolute bottom-10 left-10 z-20">
            <h2 className="text-3xl font-bold text-white mb-2">
              Discover quality.
            </h2>
            <p className="text-gray-200">
              Shop the best products at unbeatable prices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
