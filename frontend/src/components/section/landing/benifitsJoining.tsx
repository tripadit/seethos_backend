import clsx from 'clsx';
import { useContext } from 'react';
import { z } from 'zod';

import { PerspectiveView, PiggyBank, ThreeStarIcon } from '@/assets/icons';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { cn } from '@/lib/utils';

import { AppContext } from '../ChatbotSection/chatbot/context/appConetxt';
import { Chatbot } from '../ChatbotSection/chatbot/routes';

export const scheduleMeetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  organizationName: z.string().min(1, 'Organization name is required'),
});

export interface IBenifitItem {
  title: string;
  description: string;
  icon: any;
  titleClassName?: string;
  iconClassName?: string;
  subTitleClassName?: string;
}
export const BenifitsJoining = ({
  useLeftSection = true,
  children,
}: {
  useLeftSection?: boolean;
  children?: React.ReactNode;
}) => {
  const chatbot = useContext(AppContext);
  const BENIFITS: IBenifitItem[] = [
    {
      title: 'Increased Conversion Rates',
      description: 'Turn more leads into customers with our targeted approach.',
      icon: <ThreeStarIcon />,
    },
    {
      title: 'Time and Cost Efficiency',
      description: 'Save resources with automated processes and smart strategies',
      icon: <PiggyBank />,
    },
    {
      title: 'Data-Driven Decisions',
      description: 'Leverage detailed analytics for strategic business planning.',
      icon: <PerspectiveView />,
    },
  ];
  return (
    <SectionContainer className="min-h-[810px] small:mb-10" id="contact">
      <div
        className={cn(
          'grid grid-cols-2 small:flex small:flex-col gap-10 h-full items-center justify-center',
          { 'gap-0': !useLeftSection },
        )}
      >
        <div
          className={cn('flex flex-col gap-5 flex-1 justify-center ', { 'gap-0': !useLeftSection })}
        >
          {useLeftSection && (
            <>
              <h1 className="text-32 font-semibold capitalize text-neutral-900">
                Benefits of joining us
              </h1>
              <div className="grid grid-cols-2 small:flex small:flex-col gap-10">
                {BENIFITS.map((el) => (
                  <BenifitsJoiningItem {...el} key={el.title} />
                ))}
              </div>
            </>
          )}
          {!useLeftSection && <>{children}</>}
        </div>
        <div className="h-full bg-white small:pb-3 flex flex-col small:rounded-md small:gap-2 gap-4  flex-1 justify-center small:pl-4 pl-[47px] px-4 small:pt-4 pt-[80px]">
          <h1 className="small:text-32 text-48 font-bold text-neutral-900 tracking-[-2px]">
            Ready to Experience Unreal AI?
          </h1>
          <p className="small:text-sm text-xl font-normal text-[#717171]">
            Schedule Your Free Demo Today and See the Difference.
          </p>
          <div className="max-h-[440px] h-full">
            {!chatbot.isLoading && <Chatbot isSmall={true} isbenifitSection />}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export const BenifitsJoiningItem = ({
  description,
  icon,
  title,
  titleClassName,
  iconClassName,
  subTitleClassName,
}: IBenifitItem) => {
  return (
    <div data-aos={'fade-up'} data-aos-delay={250} className="flex flex-col gap-4">
      <div
        className={clsx(
          'w-[60px] h-[60px] flex justify-center rounded-md items-center shadow-benifitsCardItem',
          iconClassName,
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className={clsx('text-xl font-bold text-neutral-900', titleClassName)}>{title}</h1>
        <p
          className={clsx(
            'small:text-sm text-base font-normal text-neutral-700',
            subTitleClassName,
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
