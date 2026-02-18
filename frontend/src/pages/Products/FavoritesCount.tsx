import { useSelector } from "react-redux";
import type { FC } from "react";
import type { RootState } from "../../types";

const FavoritesCount: FC = () => {
  const favorites = useSelector((state: RootState) => state.favorites) || [];
  const favoriteCount = favorites.length;

  return (
    <div className="absolute left-2 top-8 z-20">
      {favoriteCount > 0 && (
        <span className="px-2 py-0.5 text-[10px] font-black text-white bg-linear-to-r from-blue-600 to-sky-500 rounded-full border border-blue-400/30 shadow-lg animate-pulse">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
