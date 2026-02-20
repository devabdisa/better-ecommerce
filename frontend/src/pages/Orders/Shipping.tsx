import { useState, FormEvent, FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import {
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
  FaGlobeAmericas,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";

const Shipping: FC = () => {
  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState<string>("Chapa");
  const [address, setAddress] = useState<string>(shippingAddress.address || "");
  const [city, setCity] = useState<string>(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState<string>(
    shippingAddress.postalCode || "",
  );
  const [country, setCountry] = useState<string>(shippingAddress.country || "");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 pt-24 lg:ml-[8%] transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors font-bold uppercase tracking-wider text-[10px] mb-10 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </Link>

        <ProgressSteps step1 step2 />

        <div className="flex justify-center items-center mt-10">
          <div className="w-full max-w-2xl glass-card rounded-4xl p-8 md:p-12 relative overflow-hidden group">
            <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">
              Shipping Details
            </h1>
            <p className="text-text-muted text-center text-sm mb-10 uppercase tracking-[0.2em] font-medium">
              Where should we send your order?
            </p>

            <form onSubmit={submitHandler} className="space-y-6 relative z-10">
              {/* Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">
                  Street Address
                </label>
                <div className="relative group/field">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-primary transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 rounded-xl font-medium"
                    placeholder="e.g. 123 Main St, Apt 4B"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">
                    City
                  </label>
                  <div className="relative group/field">
                    <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-primary transition-colors" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 rounded-xl font-medium"
                      placeholder="Addis Ababa"
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Postal */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">
                    Postal Code
                  </label>
                  <div className="relative group/field">
                    <FaMailBulk className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-primary transition-colors" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 rounded-xl font-medium"
                      placeholder="Zip / Postal"
                      value={postalCode}
                      required
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">
                  Country
                </label>
                <div className="relative group/field">
                  <FaGlobeAmericas className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-primary transition-colors" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 rounded-xl font-medium"
                    placeholder="Ethiopia"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 gap-4">
                  <label
                    className={`relative flex items-center p-6 bg-surface/40 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === "Chapa"
                        ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      name="paymentMethod"
                      value="Chapa"
                      checked={paymentMethod === "Chapa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === "Chapa"
                          ? "border-primary"
                          : "border-white/20"
                      }`}
                    >
                      {paymentMethod === "Chapa" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="ml-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FaMoneyBillWave size={22} />
                      </div>
                      <div>
                        <span className="text-white font-bold block">
                          Chapa Payment
                        </span>
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                          Telebirr, CBE, M-Pesa & Card
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                className="w-full bg-primary text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-primary-dark shadow-lg shadow-primary/20 mt-8"
                type="submit"
              >
                Continue to Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
