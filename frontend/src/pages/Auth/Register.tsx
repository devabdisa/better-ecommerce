import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import type { FormEvent, FC } from "react";
import type { ApiError } from "../../types";

const Register: FC = () => {
  const [username, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Registration successful");
    } catch (err) {
      const error = err as ApiError;
      console.log(error);
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white">
      <section className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 py-8">
        {/* Register Form Section */}
        <div className="md:w-1/2 w-full p-8 md:p-12 glass rounded-2xl md:rounded-r-none z-10 animate-fade-in-up md:order-1 order-2">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">
            Create Account
          </h1>
          <p className="text-gray-400 mb-8">Join the community today.</p>

          <form onSubmit={submitHandler} className="w-full">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 rounded-lg bg-surface border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
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

            <div className="mb-4">
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 rounded-lg bg-surface border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-sky-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            {isLoading && (
              <div className="mt-4">
                <Loader />
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 w-full hidden md:block h-175 md:order-2 order-1 relative group">
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
            alt="Register"
            className="h-full w-full object-cover rounded-2xl md:rounded-l-none shadow-2xl opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-10 right-10 z-20 text-right">
            <h2 className="text-3xl font-bold text-white mb-2">
              Join the revolution.
            </h2>
            <p className="text-gray-200">Exclusive deals await you inside.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
