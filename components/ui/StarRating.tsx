import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  totalRatings?: number;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = true,
  totalRatings,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(
                sizes[size],
                filled
                  ? "text-amber-400 fill-amber-400"
                  : partial
                  ? "text-amber-400 fill-amber-200"
                  : "text-gray-300 fill-gray-100"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-gray-800", textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {totalRatings !== undefined && (
        <span className={cn("text-gray-500", textSizes[size])}>
          ({totalRatings.toLocaleString()})
        </span>
      )}
    </div>
  );
}
