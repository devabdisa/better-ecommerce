import React from "react";
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

  const toggleFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
      className="absolute top-2 right-5 cursor-pointer z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm group/heart"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart
          className="text-pink-600 drop-shadow-md transition-transform duration-300 group-hover/heart:scale-110"
          size={20}
        />
      ) : (
        <FaRegHeart
          className="text-white hover:text-pink-500 transition-colors duration-300"
          size={20}
        />
      )}
    </div>
  );
};

export default HeartIcon;
