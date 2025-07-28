import { useMixpanel } from 'react-mixpanel-browser';

import { CurvedArrowPointer, RedCheckIcon } from '@/assets/icons';
import { DataDrivenDashboardImg, HeadingLine } from '@/assets/images';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV1 } from '@/mixpanel/appMixpanel';

import { SectionContainer } from '../molecules/SectionContainer';
import { Button } from '../ui/button';

export const DataDrivenDecisions = () => {
  const mixpanel = useMixpanel();
  return (
    <SectionContainer id="data-driven-decisions" className="small:py-2 py-[130px]  px-0">
      <div className="grid grid-cols-2 small:grid-cols-1 gap-10">
        <div className="flex flex-col">
          <CurvedArrowPointer className="relative top-6 small:w-[100px] small:top-8" />
          <div className="flex flex-col justify-center gap-4 h-full small:px-2 px-10 small:pl-2 pl-24 ">
            <div data-aos={'fade-left'} data-aos-delay={400} className="relative w-fit">
              <h1 className="text-neutral-900 font-bold small:text-32 text-40 tracking-tighter relative z-10">
                Data-Driven Decisions
              </h1>

              <img src={HeadingLine} className={'absolute z-[5]  bottom-[6px] '} />
            </div>
            <img src={DataDrivenDashboardImg} alt="" className="small:block hidden" />
            <p
              data-aos={'fade-up'}
              data-aos-delay={200}
              className="text-gray-500 small:text-base font-normal text-lg"
            >
              Gain valuable and real time insights from comprehensive analytics to make informed
              decisions that propel your business forward.
            </p>
            <ul className="flex flex-col gap-5 list pl-3">
              <div
                data-aos={'fade-right'}
                data-aos-delay={200}
                className="grid grid-cols-[24px_1fr] gap-3 items-center"
              >
                <RedCheckIcon />
                <li className="text-gray-500 text-sm">
                  Optimize automation based on data insights.
                </li>
              </div>
              <div
                data-aos={'fade-right'}
                data-aos-delay={200}
                className="grid grid-cols-[24px_1fr] gap-3 items-center"
              >
                <RedCheckIcon />
                <li className="text-gray-500 text-sm">
                  Use data metrics for instant process evaluation.
                </li>
              </div>
              <div
                data-aos={'fade-right'}
                data-aos-delay={200}
                className="grid grid-cols-[24px_1fr] gap-3 items-center"
              >
                <RedCheckIcon />
                <li className="text-gray-500 text-sm">
                  Anticipate trends, ensuring proactive automated decisions.
                </li>
              </div>
            </ul>
            <Button
              data-aos={'fade-right'}
              data-aos-delay={300}
              variant={'unrealPrimary'}
              className="mt-5 w-fit"
              onClick={() => {
                APPMIXPANELV1.datadriven.onClick(mixpanel);
                window.open(LANDING_CALENDLY_URL, '_blank');
              }}
            >
              Elevate Your Business
            </Button>
          </div>
        </div>
        <div>
          <img src={DataDrivenDashboardImg} alt="" className="small:hidden" />
        </div>
      </div>
    </SectionContainer>
  );
};
