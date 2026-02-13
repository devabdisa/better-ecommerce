import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { FC } from "react";

const PrivateRoute: FC = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
