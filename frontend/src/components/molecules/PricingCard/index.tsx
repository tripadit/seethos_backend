import { PricingRedCheck, PricingWhiteCheck } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IPaymentProps } from '@/constants/pricingData';
import { cn, LANDING_CALENDLY_URL } from '@/lib/utils';

export const PricingCard = ({
  title,
  features,
  selectedPlan,
  idealFor,
  description,
}: IPaymentProps) => {
  return (
    <Card
      className={cn(
        'relative flex flex-col md:py-10 p-4 md:p-5 rounded-[20px] shadow-pricingCard min-w-[280px] bg-white w-full h-full items-center',
        { 'bg-unrealPrimary': selectedPlan },
      )}
    >
      <div className="flex flex-col gap-2.5 h-full">
        <div
          className={cn(
            'px-4 py-2 rounded-[100px] bg-unrealPrimary text-white font-semibold text-base',
            { 'bg-white text-unrealPrimary-400': selectedPlan },
          )}
        >
          {title}
        </div>

        <p className={cn('text-sm text-[#545454]', { 'text-[#FFEEEE]': selectedPlan })}>
          {description}
        </p>

        <div className={cn('mt-1.5 h-[0.2px] bg-black', { 'bg-white': selectedPlan })}></div>

        <div className="flex flex-1 flex-col mt-1.5">
          <ul className="flex flex-col gap-4">
            {features.map((item, index) => (
              <div className="grid grid-cols-[24px_1fr] items-center gap-4">
                <PricingRedCheck className={cn({ hidden: selectedPlan })} />
                <PricingWhiteCheck className={cn({ hidden: !selectedPlan })} />
                <li
                  key={index}
                  className={cn('text-sm text-black font-semibold', {
                    'text-[#FFEEEE]': selectedPlan,
                  })}
                >
                  {item}
                </li>
              </div>
            ))}
          </ul>
        </div>

        <div className={cn('mt-1.5 h-[0.2px] bg-black', { 'bg-white': selectedPlan })}></div>

        <p
          className={cn('text-sm text-black my-2.5 min-h-[80px] ', {
            'text-[#FFEEEE]': selectedPlan,
          })}
        >
          {idealFor}
        </p>

        <Button
          variant={'unrealPrimary'}
          className={cn('', { 'bg-white text-[#0D0D0D] hover:bg-gray-200': selectedPlan })}
          onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
        >
          Choose Plan
        </Button>
      </div>
    </Card>
  );
};
