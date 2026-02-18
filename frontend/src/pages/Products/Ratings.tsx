import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import type { FC } from "react";

interface RatingsProps {
  value: number;
  text?: string;
  color?: string;
}

const Ratings: FC<RatingsProps> = ({ value, text, color = "yellow-500" }) => {
  const roundedValue = Math.min(5, Math.max(0, value));
  const fullStars = Math.floor(roundedValue);
  const hasHalfStar = roundedValue % 1 >= 0.25 && roundedValue % 1 < 0.75;
  const isFullNext = roundedValue % 1 >= 0.75;

  const actualFullStars = isFullNext ? fullStars + 1 : fullStars;
  const halfStars = hasHalfStar ? 1 : 0;
  const emptyStars = Math.max(0, 5 - actualFullStars - halfStars);

  const starColor = color === "yellow-500" ? "text-[#FFB800]" : "text-blue-400";

  return (
    <div
      className="flex items-center gap-0.5"
      title={`${value} out of 5 stars`}
    >
      <div className="flex items-center">
        {[...Array(actualFullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className={`${starColor} w-4 h-4`} />
        ))}

        {halfStars === 1 && (
          <FaStarHalfAlt className={`${starColor} w-4 h-4`} />
        )}

        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar
            key={`empty-${index}`}
            className="text-gray-600/50 w-4 h-4"
          />
        ))}
      </div>

      {text && (
        <span className="ml-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2 py-0.5 rounded-sm">
          {text}
        </span>
      )}
    </div>
  );
};

export default Ratings;
