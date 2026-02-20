import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { FormEvent, FC } from "react";
import type { ApiError } from "../../types";

const Profile: FC = () => {
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { userInfo } = useAppSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const dispatch = useAppDispatch();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo!._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        const error = err as ApiError;
        toast.error(error?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-24 lg:ml-[8%] flex items-center justify-center transition-all duration-300">
      <div className="flex flex-col md:flex-row shadow-2xl rounded-[2.5rem] overflow-hidden max-w-4xl w-full glass-card border border-white/5">
        {/* Left Side: Illustration / Profile Info */}
        <div className="md:w-1/3 bg-linear-to-br from-blue-600 to-sky-800 p-8 flex flex-col items-center justify-center text-white">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold mb-4 ring-4 ring-white/30 shadow-lg">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">{username}</h2>
          <p className="text-blue-200 text-sm mb-6 text-center">{email}</p>
          <Link
            to="/user-orders"
            className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-full text-center hover:bg-gray-100 transition-colors shadow-md"
          >
            My Orders
          </Link>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8 bg-surface">
          <h2 className="text-2xl font-bold text-blue-500 mb-6 border-b border-gray-700 pb-2">
            Update Profile
          </h2>

          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="w-full p-3 rounded-lg bg-background border border-gray-600 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full p-3 rounded-lg bg-background border border-gray-600 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full p-3 rounded-lg bg-background border border-gray-600 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full p-3 rounded-lg bg-background border border-gray-600 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-linear-to-r from-blue-600 to-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                Update Profile
              </button>
            </div>
            {loadingUpdateProfile && (
              <div className="mt-4">
                <Loader />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
