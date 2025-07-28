import './style.css';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export const StarRating = ({ value = 0, onChange, disabled = false }: RatingProps) => {
  const [rating, setRating] = useState(Math.round(value));
  const [hover, setHover] = useState(Math.round(value));

  useEffect(() => {
    setRating(Math.round(value));
    setHover(Math.round(value));
  }, [value]);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= ((hover && rating) || hover) ? 'on' : 'off'}
            onClick={() => {
              if (!disabled) {
                const roundedValue = Math.round(index);
                setRating(roundedValue);
                onChange(roundedValue);
              }
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            onDoubleClick={() => {
              setRating(0);
              setHover(0);
              onChange(0);
            }}
          >
            <Star />
          </button>
        );
      })}
    </div>
  );
};
