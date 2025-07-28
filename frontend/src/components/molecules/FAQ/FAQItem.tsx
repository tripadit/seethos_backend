import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
export interface IFAQItems {
  question: string;
  answer: string;
  className?: string;
}

export const FAQItems = ({ question, answer, className }: IFAQItems) => {
  const [itemOpen, setItemOpen] = useState<boolean>(false);
  return (
    <div
      className={cn('border border-purple-500 rounded-md px-5 py-5 cursor-pointer', className)}
      onClick={(e) => {
        e.stopPropagation();
        setItemOpen(!itemOpen);
      }}
    >
      <div className="flex justify-between items-center">
        <h5 className="text-black/90 text-xl tablet:text-[16px] mobile:text-[16px] font-bold select-none">
          {question}
        </h5>
        <div
          className="h-full cursor-pointer p-[4px]  select-none"
          onClick={() => setItemOpen(!itemOpen)}
        >
          {itemOpen ? (
            <Minus className="mobile:h-[16px] mobile:w-[16px]" />
          ) : (
            <Plus className="mobile:h-[16px] mobile:w-[16px]" />
          )}
        </div>
      </div>
      {itemOpen && (
        <p className="select-none text-black/70  py-[16px] mobile:text-[14px]">{answer}</p>
      )}
    </div>
  );
};
