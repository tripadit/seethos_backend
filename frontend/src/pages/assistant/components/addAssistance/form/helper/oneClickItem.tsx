import clsx from 'clsx';

import { CloseIcon } from '@/assets/icons';
interface IOneClickItemProps {
  isActive?: boolean;
  onClick?: () => void;
  text: string;
  showRemove?: boolean;
  onRemove?: () => void;
}
export const OneClickItem = ({
  onClick,
  text,
  isActive,
  showRemove,
  onRemove,
}: IOneClickItemProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'h-[28px] py-1 gap-2 px-3 w-fit rounded-full text-sm whitespace-nowrap font-medium hover:border-purple-50 border border-solid flex justify-center items-center cursor-pointer hover:text-purple-700 hover:bg-purple-50',
        {
          'text-purple-700 bg-purple-50': isActive,
          'border-gray-500 text-gray-700': !isActive,
        },
      )}
    >
      {text}
      {showRemove && <CloseIcon onClick={onRemove} />}
    </div>
  );
};
