import clsx from 'clsx';
interface IFeatureInfoCard {
  heading: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  index?: number;
}

export const FeatureInfoCard = ({
  description,
  isActive,
  onClick,
  heading,
  index = 1,
}: IFeatureInfoCard) => {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={200 * index}
      data-aos-offset={'0'}
      onClick={onClick}
      className={clsx(
        'lg:w-[488px] w-full hover:bg-[#212136]   p-6 rounded-md flex flex-col gap-2 cursor-pointer ',
        {
          'bg-[#212136] ': isActive,
          'bg-transparent': !isActive,
        },
      )}
    >
      <h1
        className={clsx(' text-lg sm:text-[28px] sm:leading-[34px] font-bold sm:tracking-[-2px]', {
          'text-white ': isActive,
          'text-[#DEDFFF]/60': !isActive,
        })}
      >
        {heading}
      </h1>
      <p
        className={clsx('t sm:text-lg text-sm', {
          'text-white/80 ': isActive,
          'text-[#DEDFFF]/40': !isActive,
        })}
      >
        {description}
      </p>
    </div>
  );
};
