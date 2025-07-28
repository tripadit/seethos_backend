import { useMixpanel } from 'react-mixpanel-browser';

import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV2 } from '@/mixpanel/appMixpanel';

export const ReadyToAutomate = () => {
  const mixpanel = useMixpanel();
  return (
    <SectionContainer className="ready-to-automate-bg h-[278px]" innerClassName="h-full">
      <div className="flex flex-col flex-1 justify-center items-center h-full gap-10">
        <h1
          data-aos={'zoom-in-up'}
          data-aos-delay={400}
          className="capitalize  font-roboto text-2xl sm:text-48  text-center sm:leading-[48px] tracking-tighter font-semibold text-white"
        >
          Ready to automate <br /> your business Development?
        </h1>
        <Button
          variant={'unrealPrimaryBtn'}
          size={'lg'}
          className="mobile:w-full whitespace-nowrap h-[50px] px-14 text-base font-semibold"
          onClick={() => {
            APPMIXPANELV2.readyToAutomate.onClick(mixpanel);
            window.open(LANDING_CALENDLY_URL, '_blank');
          }}
        >
          Try Out Unreal AI
        </Button>
      </div>
    </SectionContainer>
  );
};
