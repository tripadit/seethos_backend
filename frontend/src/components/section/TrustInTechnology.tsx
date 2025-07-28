import { useMixpanel } from 'react-mixpanel-browser';

import { RedCheckIcon } from '@/assets/icons';
import { MarketingVideo } from '@/assets/video';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV1 } from '@/mixpanel/appMixpanel';

import { SectionContainer } from '../molecules/SectionContainer';
import { Button } from '../ui/button';

export const TrustInTechnology = () => {
  const mixpanel = useMixpanel();
  return (
    <SectionContainer id="works" className="bg-[#57000F]  ">
      <div className="flex justify-between w-full items-center trust-technology-section">
        <div className="grid grid-cols-2 items-center gap-10 py-80.1 small:flex small:flex-col small:py-10 ">
          <div className="h-full w-full">
            <div className="flex flex-col small:items-center gap-4 small:pt-0  pt-10 sm:pl-10 h-full small:max-w-full max-w-[600px] w-full">
              <h2
                data-aos="fade-up"
                data-aos-delay={'100'}
                data-aos-offset={'10'}
                className="small:text-32 small:text-center  text-48 font-extrabold text-white sm:leading-[52.8px]"
              >
                Revolutionizing Marketing with AI
              </h2>
              <div
                className=" h-max w-full rounded-md overflow-hidden  hidden small:block"
                data-aos="fade-left"
                data-aos-delay={'1000'}
                data-aos-offset={'0'}
              >
                <video autoPlay muted controls className="w-full ">
                  <source src={MarketingVideo} type="video/mp4" />
                </video>
              </div>
              <ul className="flex flex-col gap-5 list pl-3">
                <div
                  className="grid grid-cols-[24px_1fr] gap-3 "
                  data-aos="fade-right"
                  data-aos-delay={'50'}
                  data-aos-offset={'0'}
                >
                  <RedCheckIcon />
                  <li className="text-white text-sm">
                    <strong className="text-base">
                      {' '}
                      65% Increase in Lead Generation Effectiveness:
                    </strong>{' '}
                    Targeted AI algorithms identify ideal customers efficiently based on your ICP.
                  </li>
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-delay={'100'}
                  data-aos-offset={'0'}
                  className="grid grid-cols-[24px_1fr] gap-3 "
                >
                  <RedCheckIcon />
                  <li className="text-white text-sm">
                    <strong className="text-base"> 43% Higher Email Conversions:</strong>{' '}
                    Personalized email campaigns resonate more with recipients.
                  </li>
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-delay={'150'}
                  data-aos-offset={'0'}
                  className="grid grid-cols-[24px_1fr] gap-3 "
                >
                  <RedCheckIcon />
                  <li className="text-white text-sm">
                    <strong className="text-base">55% More Social Media Engagement:</strong>{' '}
                    Optimized content and timing boost interactions.
                  </li>
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-delay={'200'}
                  data-aos-offset={'0'}
                  className="grid grid-cols-[24px_1fr] gap-3 "
                >
                  <RedCheckIcon />
                  <li className="text-white text-sm">
                    <strong className="text-base">60% Improved Ad ROI:</strong>Real-time campaign
                    adjustments maximize ad spend effectiveness.
                  </li>
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-delay={'250'}
                  data-aos-offset={'0'}
                  className="grid grid-cols-[24px_1fr] gap-3 "
                >
                  <RedCheckIcon />
                  <li className="text-white text-sm">
                    <strong className="text-base">80% Lower Operational Costs:</strong>Automation of
                    routine tasks reduces marketing expenses.
                  </li>
                </div>
              </ul>
              <Button
                data-aos="fade-up"
                data-aos-delay={'150'}
                data-aos-offset={'0'}
                variant={'unrealPrimary'}
                className="w-fit"
                onClick={() => {
                  APPMIXPANELV1.trustInTechnology.onClick(mixpanel);
                  window.open(LANDING_CALENDLY_URL, '_blank');
                }}
              >
                Try Out Unreal AI
              </Button>
            </div>
          </div>
          <div
            data-aos="zoom-in-up"
            data-aos-delay={650}
            data-aos-offset={'0'}
            className=" h-max w-full rounded-md overflow-hidden small:hidden"
          >
            <video autoPlay muted controls className="w-full ">
              <source src={MarketingVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
