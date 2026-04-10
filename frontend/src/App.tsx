import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "./redux/hooks";
import { setFavorites } from "./redux/features/favorites/favoriteSlice";
import { getFavoritesFromLocalStorage } from "./utils/localStorage";
import ScrollToTop from "./components/ScrollToTop";
import Background from "./components/Background";
import MaintenanceBanner from "./components/MaintenanceBanner";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  return (
    <div className="relative min-h-screen">
      <MaintenanceBanner />
      <ToastContainer theme="dark" position="top-right" />
      <ScrollToTop />
      <Background />
      <Navigation />
      <main className="transition-all duration-300" style={{ paddingTop: "41px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
