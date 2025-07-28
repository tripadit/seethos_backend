import { useContext } from 'react';

import { PerspectiveView, PiggyBank, ThreeStarIcon } from '@/assets/icons';
import { cn } from '@/lib/utils';

import { AppContext } from '../ChatbotSection/chatbot/context/appConetxt';
import { Chatbot } from '../ChatbotSection/chatbot/routes';
import { BenifitsJoiningItem, IBenifitItem } from './benifitsJoining';

export const BenifitsOfJoining = () => {
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
    <section className="benifit-of-joining-bg py-80.1" id="contact">
      <div className={cn('grid lg:grid-cols-2 grid-cols-1  h-full min-h-[750px]')}>
        <div
          className={cn(
            'flex flex-col gap-5 flex-1 justify-center items-center benifit-of-joining-bg border-b border-t border-white/20',
          )}
        >
          <div className="max-w-[592px] w-full flex flex-col gap-10 py-10 px-5">
            <h1 className="text-32 font-semibold capitalize text-white">Benefits of joining us</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {BENIFITS.map((el) => (
                <BenifitsJoiningItem
                  {...el}
                  key={el.title}
                  iconClassName="bg-white"
                  titleClassName="text-white"
                  subTitleClassName="text-white/80"
                />
              ))}
            </div>
          </div>
        </div>
        <div className=" bg-white small:pb-3 flex flex-col h-full  small:gap-2 gap-4  lg:items-start items-center flex-1 py-80.1 small:pl-4 pl-[47px] small:pt-4 pt-[80px]">
          <div className="flex flex-col flex-1 max-w-[600px] w-full ">
            <h1 className="small:text-32 font-roboto text-[40px] font-bold text-neutral-900 tracking-[-2px]">
              Ready to Experience Unreal AI?
            </h1>
            <p className="small:text-sm text-xl font-normal text-[#717171]">
              Schedule Your Free Demo Today and See the Difference.
            </p>
            <div className="lg:max-h-[550px] max-h-[400px]  mt-5">
              {!chatbot.isLoading && <Chatbot isSmall isbenifitSection />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
