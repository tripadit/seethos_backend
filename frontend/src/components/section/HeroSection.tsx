import { useContext } from 'react';
import { useMixpanel } from 'react-mixpanel-browser';

import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV1 } from '@/mixpanel/appMixpanel';

import { SectionContainer } from '../molecules/SectionContainer';
import { Button } from '../ui/button';
import { AppContext } from './ChatbotSection/chatbot/context/appConetxt';
import { Chatbot } from './ChatbotSection/chatbot/routes';

export const HeroSection = () => {
  const chatbot = useContext(AppContext);
  const mixpanel = useMixpanel();
  return (
    <SectionContainer
      id="hero"
      className="max-h-screen hero-section-container "
      innerClassName="max-h-screen min-h-[80vh] mobile:h-[800px]"
    >
      <div className="flex flex-row  overflow-hidden  small:flex-col small:gap-5  pt-16 pb-5 sm:py-80.1  h-full flex-1 small:justify-center justify-between laptop:items-center  desktop:items-center">
        <div className="hero-wrapper flex flex-col items-center gap-10 sm:first-letter:p-5">
          <div className="flex flex-col  max-w-[800px] w-full justify-center items-center">
            <h1
              data-aos="fade-up"
              data-aos-delay={'500'}
              data-aos-offset={'0'}
              className="font-bold text-neutral-900 mobile:mt-3 md:leading-[45px] xl:leading-[55px] mt-3 mobile:text-2xl text-48 text-center tracking-tighter"
            >
              Transform Your Business with Autonomous Professional Assistants
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={'550'}
              data-aos-offset={'0'}
              className="text-sm sm:text-lg font-normal text-neutral-700 mb-2"
            >
              Unleash the Power of AI in Your Business
            </p>
            <Button
              data-aos="fade-up"
              data-aos-delay={'600'}
              data-aos-offset={'0'}
              variant={'unrealPrimary'}
              className="w-fit"
              onClick={() => {
                APPMIXPANELV1.herosection.tryOutUnrealAi(mixpanel);
                window.open(LANDING_CALENDLY_URL, '_blank');
              }}
            >
              Try Out Unreal AI
            </Button>
          </div>

          {!chatbot.isLoading && <Chatbot showImages />}
        </div>
      </div>
    </SectionContainer>
  );
};
