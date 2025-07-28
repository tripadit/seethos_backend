import loadable from '@loadable/component';
import { useMixpanel } from 'react-mixpanel-browser';

import { ANIMATION } from '@/assets/animation';
import { ScaleHeading } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV1 } from '@/mixpanel/appMixpanel';
const Lottie = loadable(() => import('react-lottie'));
export const ScaleOutreach = () => {
  const mixpanel = useMixpanel();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ANIMATION.ScaleOutreach,
  };
  return (
    <div className="scale-outreach-bg ">
      <SectionContainer id="features" className="py-[102px] w-full  ">
        <div className="flex flex-row small:flex-col-reverse items-center gap-10 flex-1 w-full">
          <div className="flex flex-col ">
            <div data-aos={'fade-right'} data-aos-delay={800} className="relative w-fit">
              <h1 className="text-neutral-900 font-bold small:text-32 text-40 tracking-tighter relative z-10">
                Scale Your Outreach
              </h1>
              <img src={ScaleHeading} className={'absolute z-[5]  bottom-2 -left-1 '} />
            </div>
            <p
              data-aos={'fade-up'}
              data-aos-delay={650}
              className="small:text-sm text-lg font-normal flex-1 text-neutral-700 max-w-[1200px]"
            >
              {`Unreal AI professional assistants empower businesses to scale their outreach efforts effortlessly. By automating the identification and engagement of potential leads, these Professional Assistants enable companies to reach a wider audience without increasing their workload. They analyze market trends, customer behavior, and engagement data to optimize communication strategies in real-time, ensuring messages resonate with the target audience. This scalable approach not only maximizes outreach efficiency but also enhances the potential for growth, allowing businesses to expand their customer base and market presence rapidly and effectively, all while maintaining personalized and impactful interactions.`}
            </p>
            <Button
              data-aos={'fade-up'}
              data-aos-delay={500}
              variant={'unrealPrimary'}
              className="mt-5 w-fit"
              onClick={() => {
                APPMIXPANELV1.scaleOutReach.onClick(mixpanel);
                window.open(LANDING_CALENDLY_URL, '_blank');
              }}
            >
              Outreach at Scale
            </Button>
          </div>

          <div data-aos={'zoom-in-left'} data-aos-delay={600} className="w-[100%]">
            <Lottie options={defaultOptions} />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
