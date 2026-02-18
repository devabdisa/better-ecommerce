import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import type { FC } from "react";
import type { Product } from "../../types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addFavoriteToLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../utils/localStorage";

interface HeartIconProps {
  product: Product;
}

const HeartIcon: FC<HeartIconProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer z-10 p-2 rounded-full hover:bg-black/20 transition-all duration-300"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-sky-500 drop-shadow-md" size={24} />
      ) : (
        <FaRegHeart
          className="text-white hover:text-sky-400 transition-colors"
          size={24}
        />
      )}
    </div>
  );
};

export default HeartIcon;
