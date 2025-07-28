import loadable from '@loadable/component';

import { ANIMATION } from '@/assets/animation';
import { ScaleHeading } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
const Lottie = loadable(() => import('react-lottie'));
export const SeamLessIntegration = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ANIMATION.SeamlessIntegration,
  };
  return (
    <div className="semless-integration-bg">
      <SectionContainer id="features" className="small:pt-0 py-[110px] w-full  ">
        <div
          data-aos={'zoom-in-up'}
          data-aos-delay={200}
          className="flex flex-row  small:flex-col-reverse gap-10 flex-1 w-full"
        >
          <div className="flex flex-col small:gap-10 gap-[111px] w-full small:pt-0 pt-[100px]">
            <div
              data-aos={'fade-right'}
              data-aos-delay={200}
              className="flex flex-col max-w-[534px]"
            >
              <div className="relative w-fit">
                <h1 className="text-neutral-900 font-bold small:text-32 text-40 tracking-tighter relative z-10">
                  Seamless Integration
                </h1>
                <img src={ScaleHeading} className={'absolute z-[5]  bottom-2 -left-1 '} />
              </div>
              <p className="small:text-sm text-lg font-normal text-neutral-700">
                Easily integrate Unreal AI into your existing systems and witness the transformation
                in real-time.
              </p>
            </div>
            <div
              data-aos={'fade-left'}
              data-aos-delay={200}
              className="flex flex-row justify-end items-end"
            >
              <div className="flex flex-col max-w-[500px]">
                <div className="relative w-fit">
                  <h1 className="text-neutral-900 small:text-32 font-bold text-40 tracking-tighter relative z-10">
                    24/7 Support
                  </h1>
                  <img src={ScaleHeading} className={'absolute z-[5]  bottom-2 -left-1 '} />
                </div>
                <p className="small:text-sm text-lg font-normal text-neutral-700">
                  Our team of experts is always available to assist you in maximizing the benefits
                  of AI for your business
                </p>
              </div>
            </div>
          </div>
          <div className="w-[100%] small:hidden">
            <Lottie
              options={defaultOptions}
              height={600}
              width={600}
              style={{
                position: 'relative',
                right: '-80px',
              }}
            />
          </div>
          <div className="w-[100%] hidden small:block">
            <Lottie
              options={defaultOptions}
              height={300}
              width={300}
              style={{
                position: 'relative',
              }}
            />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
