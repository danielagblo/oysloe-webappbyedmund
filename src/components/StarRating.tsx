import React from "react";

interface StarRatingProps {
  count?: number;
  rating?: number;
  size?: string;
  onColor?: string;
  offColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  rating = 0,
  size = "text-base",
  onColor = "text-yellow-500",
  offColor = "text-gray-300",
}) => {
  return (
    <p className={size + " my-4"}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i < rating ? onColor : offColor}>
          ★
        </span>
      ))}
    </p>
  );
};

export default StarRating;
