import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
export interface IBusinessNeedItemProps {
  image: any;
  description: string;
  title: string;
  buttonTitle: string;
  onClick: () => void;
  index?: number;
}
export const BusinessNeedItem = ({
  buttonTitle,
  description,
  image,
  onClick,
  title,
  index = 1,
}: IBusinessNeedItemProps) => {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={200 * index}
      data-aos-offset={'0'}
      className="border border-white/20 shadow-heroInput cursor-pointer hover:bg-business-need-gradient rounded-xl bg-[#141526] flex flex-col gap-7 items-center justify-between px-4 py-8"
    >
      <div className="flex flex-col gap-8 items-center">
        <img src={image} className="w-[80px] h-[80px]" />
        <h1 className="text-[28px] font-bold text-white tracking-tighter leading-[33px]">
          {title}
        </h1>
        <p className="text-lg text-white/80 font-normal text-center">{description}</p>
      </div>
      <Button onClick={onClick} className="text-purple-500 text-lg" variant={'default'} size={'lg'}>
        {buttonTitle} <ChevronRight className="" size={20} />
      </Button>
    </div>
  );
};
