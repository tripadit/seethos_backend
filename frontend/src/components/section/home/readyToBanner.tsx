import { useMixpanel } from 'react-mixpanel-browser';

import { BusinessImg } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV2 } from '@/mixpanel/appMixpanel';

export const ReadyToBanner = () => {
  const mixpanel = useMixpanel();
  return (
    <SectionContainer id="ready-to-elevate" className="py-80.1 mobile:py-10 background-cta">
      <div className="flex justify-center items-center">
        <div className=" max-w-[887px] w-full flex sm:flex-row flex-col justify-between items-center gap-10">
          <div className="small:flex small:flex-col small:items-center small:justify-center">
            <h1
              data-aos={'zoom-in-up'}
              data-aos-delay={400}
              className="capitalize font-roboto text-3xl sm:text-48 sm:leading-[58px] tracking-tighter font-semibold text-white"
            >
              Ready to <br /> automate your <br /> business Development?
            </h1>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <img
              src={BusinessImg}
              alt="ready-to-elevate-business"
              className=" w-[126px] h-[126px] object-contain"
            />
            <Button
              variant={'unrealPrimaryBtn'}
              className="whitespace-nowrap px-8"
              onClick={() => {
                APPMIXPANELV2.readyToAutomate.onClick(mixpanel);
                window.open(LANDING_CALENDLY_URL, '_blank');
              }}
            >
              Try Out Unreal AI
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
