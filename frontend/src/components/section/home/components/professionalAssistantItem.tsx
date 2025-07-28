import clsx from 'clsx';
import React from 'react';
export interface IProfessionalAssistantItem {
  image: string;
  title: string;
  className: string;
  description: string;
  index?: number;
}
export const ProfessionalAssistantItem: React.FC<IProfessionalAssistantItem> = ({
  className,
  description,
  image,
  title,
  index = 1,
}: IProfessionalAssistantItem) => {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={200 * index}
      data-aos-offset={'0'}
      className={clsx(
        'border border-white/20 rounded-xl bg-transparent p-10 gap-10 shadow-professionalAssistance flex flex-col items-center ',
        className,
      )}
    >
      <img src={image} className="" />
      <div className="flex flex-col flex-1 item-center gap-2">
        <h1 className="text-white font-bold text-xl sm:text-32 sm:leading-[39px] text-center tracking-tighter">
          {title}
        </h1>
        <p className="text-sm sm:text-lg text-white/80 sm:leading-[28px] font-normal text-center">
          {description}
        </p>
      </div>
    </div>
  );
};
