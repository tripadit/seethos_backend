import { useMixpanel } from 'react-mixpanel-browser';

import { BusinessImg } from '@/assets/images';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV1 } from '@/mixpanel/appMixpanel';

import { SectionContainer } from '../molecules/SectionContainer';
import { Button } from '../ui/button';

export const ReadyToElevate = () => {
  const mixpanel = useMixpanel();
  return (
    <SectionContainer id="ready-to-elevate" className="py-80.1 mobile:py-10 ready-to-elevate">
      <div className=" flex small:flex-col-reverse justify-between items-center gap-10">
        <div className="small:flex small:flex-col small:items-center small:justify-center">
          <h1
            data-aos={'zoom-in-up'}
            data-aos-delay={400}
            className="small:text-[26px] small:font-bold small:leading-10 small:mb-4  capitalize small:text-center text-52 font-semibold text-[#090914]"
          >
            Ready to automate your business development?
          </h1>
          <Button
            data-aos={'zoom-in-down'}
            data-aos-delay={400}
            className="try-out-btn font-semibold leading-6"
            onClick={() => {
              APPMIXPANELV1.readyToElevate.onClick(mixpanel);
              window.open(LANDING_CALENDLY_URL, '_blank');
            }}
          >
            Try Out Unreal AI
          </Button>
        </div>
        <img src={BusinessImg} alt="ready-to-elevate-business" />
      </div>
    </SectionContainer>
  );
};
