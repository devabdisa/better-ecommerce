import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import type { FormEvent, FC } from "react";
import type { ApiError } from "../../types";
import Meta from "../../components/Meta";
import { FaLock, FaEnvelope, FaShoppingBag } from "react-icons/fa";

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
      toast.success("Welcome back to Better Store!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        error?.data?.message ||
          error.error ||
          "Login failed. Please check your details.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden font-sans">
      <Meta title="Login | Better Store" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        <div className="glass-card rounded-[2.5rem] p-10 lg:p-16 border-white/5 shadow-2xl space-y-10 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-4">
            <div className="px-4 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-fit">
              Premium Shopping
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Welcome <span className="text-primary">Back</span>
            </h1>
            <p className="text-text-muted font-medium text-sm">
              Sign in to access your wishlist, orders, and personalized offers.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-primary focus:bg-white/[0.05] transition-all outline-none font-medium placeholder:text-white/10"
                  placeholder="meetabdisa@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">
                Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-primary focus:bg-white/[0.05] transition-all outline-none font-medium placeholder:text-white/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Enter Store
                  <FaShoppingBag className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {isLoading && <Loader />}
          </form>

          <p className="text-center text-text-muted text-xs font-bold uppercase tracking-widest pt-6 border-t border-white/5">
            New to Better Store?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-primary hover:text-white transition-colors ml-2 underline underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Decorative Side Content */}
        <div className="hidden lg:flex relative rounded-[2.5rem] overflow-hidden group animate-in fade-in slide-in-from-right duration-1000">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Premium Shopping Experience"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3s]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-black/20 to-transparent" />

          <div className="relative z-10 m-auto text-center space-y-6 max-w-xs px-6">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center mx-auto shadow-2xl">
              <FaShoppingBag className="text-white text-3xl" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Luxury Defined
              </h3>
              <p className="text-white/70 text-xs font-medium leading-relaxed">
                Step into a world of curated collections and exclusive designs
                crafted for those who settle for nothing but the best.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
