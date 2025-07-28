import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { DeleteReviewDialog } from '@/components/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { getAbbreviation } from '@/lib/utils';

import { CTooltip, StarRating } from '..';

export interface IReviewCardProps {
  id?: string;
  review: string;
  rating: number;
  title: string;
  company?: string;
  name: string;
  image?: string;
  onClick?: () => void;
  refetch?: any;
  enableHoverMenu?: boolean;
}

const ReviewCard = ({
  id,
  review,
  rating,
  title,
  company,
  name,
  image,
  refetch,
  onClick,
  enableHoverMenu = true,
}: IReviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const toggleModal = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  return (
    <>
      <Card
        className="relative p-3 border-none rounded-lg flex flex-col justify-between gap-4 shadow-md cursor-pointer"
        onMouseEnter={() => enableHoverMenu && setIsHovered(true)}
        onMouseLeave={() => enableHoverMenu && setIsHovered(false)}
      >
        <div>
          <p>{review}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="">
              <AvatarImage src={image} />
              <AvatarFallback>{getAbbreviation(name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-black">{name}</p>
              <p className="text-blueGray-500 text-[10px]">
                {title} {company}
              </p>
            </div>
          </div>
          <StarRating value={rating} onChange={() => {}} disabled />
        </div>
        {isHovered && (
          <div className="absolute inset-0 bg-gray-50/90 items-center justify-center gap-8 flex">
            <CTooltip text="Edit Review">
              <div className="p-3 bg-gray-500 rounded-lg" onClick={onClick}>
                <Edit className="text-white hover:text-[#F5536E] " />
              </div>
            </CTooltip>
            <CTooltip text="Delete Review">
              <div className="p-3 bg-gray-500 rounded-lg" onClick={toggleModal}>
                <Trash2 className="text-white hover:text-[#F5536E] " />
              </div>
            </CTooltip>
          </div>
        )}
      </Card>

      <DeleteReviewDialog
        isOpen={isDeleteOpen}
        onClose={toggleModal}
        review={{ id, review, rating, title, company, name, image }}
        onDelete={refetch}
      />
    </>
  );
};

export default ReviewCard;
