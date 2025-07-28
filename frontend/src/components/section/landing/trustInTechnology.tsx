import loadable from '@loadable/component';

import { ANIMATION } from '@/assets/animation';
import { HeadingLine } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
const Lottie = loadable(() => import('react-lottie'));
export const TrustInTechnologySection = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ANIMATION.RealTimeDataAnalysis,
  };
  return (
    <div className="">
      <SectionContainer id="features" className="py-[102px] w-full  ">
        <div className=" gap-10 grid grid-cols-2 w-full items-center">
          <div className="flex flex-col gap-[111px] w-full">
            <div className="flex flex-col max-w-[480px]">
              <div className="relative w-fit">
                <h1 className="text-neutral-900 font-bold text-40 mb-4 leading-10  relative z-10">
                  Real-Time Analytics & Insights
                </h1>
                <img src={HeadingLine} className={'absolute z-[5]  top-7 left-0  w-[210px]'} />
              </div>
              <p className="text-lg font-normal text-neutral-700">
                Make informed decisions with a comprehensive dashboard that presents real-time data
                on your marketing performance. Track conversions, engagement, and campaign
                effectiveness at a glance.
              </p>
              <Button
                variant={'unrealPrimary'}
                className="mt-5 w-max"
                onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
              >
                Gain Instant Insights Now
              </Button>
            </div>
          </div>

          <div className="w-full trust-in-farme flex flex-col flex-1 justify-center items-center ">
            <Lottie options={defaultOptions} height={600} width={600} />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
