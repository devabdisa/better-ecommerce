import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import type { FormEvent, FC } from "react";
import type { ApiError } from "../../types";
import Meta from "../../components/Meta";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaGem } from "react-icons/fa";

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
      toast.success("Account created! Welcome to the family.");
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        error?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden font-sans">
      <Meta title="Join Us | Better Store" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        {/* Decorative Side Content */}
        <div className="hidden lg:flex relative rounded-[2.5rem] overflow-hidden group animate-in fade-in slide-in-from-left duration-1000">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Fashion and Style"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3s]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-transparent" />

          <div className="relative z-10 m-auto text-center space-y-6 max-w-xs">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <FaGem className="text-white text-3xl" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Vibrant Lifestyle
              </h3>
              <p className="text-white/70 text-xs font-medium leading-relaxed">
                Join our community of trendsetters. Get early access to new
                drops, special member pricing, and 24/7 VIP support.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 lg:p-16 border-white/5 shadow-2xl space-y-10 animate-in fade-in slide-in-from-right duration-1000">
          <div className="space-y-4">
            <div className="px-4 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-fit">
              Membership
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Create <span className="text-primary">Account</span>
            </h1>
            <p className="text-text-muted font-medium text-sm">
              Your journey to a premium shopping experience starts here.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">
                  Full Name
                </label>
                <div className="relative group">
                  <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-primary focus:bg-white/[0.05] transition-all outline-none font-medium"
                    placeholder="Your Name"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">
                  Email Address
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-primary focus:bg-white/[0.05] transition-all outline-none font-medium"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">
                  Password
                </label>
                <div className="relative group">
                  <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-primary focus:bg-white/[0.05] transition-all outline-none font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">
                  Confirm Password
                </label>
                <div className="relative group">
                  <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-primary focus:bg-white/[0.05] transition-all outline-none font-medium"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Join the Community
                  <FaUserPlus className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>

            {isLoading && <Loader />}
          </form>

          <p className="text-center text-text-muted text-xs font-bold uppercase tracking-widest pt-6 border-t border-white/5">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-primary hover:text-white transition-colors ml-2 underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
