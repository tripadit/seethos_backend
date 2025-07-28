import { SectionContainer } from '@/components/molecules/SectionContainer';

import { UnrealAiCarousel } from './helper';
export const AboutUnrealAi = () => {
  return (
    <SectionContainer className="py-80.1 ">
      <div className="flex flex-col gap-10">
        <div>
          <h1
            data-aos="fade-up"
            data-aos-delay={'200'}
            data-aos-offset={'0'}
            className="font-bold text-white mobile:mt-3 md:leading-[45px] xl:leading-[67px] mobile:text-3xl text-[56px] text-center tracking-[-1px]"
          >
            About Unreal AI
          </h1>
        </div>
        <div className="flex flex-row w-full items-center justify-center">
          <UnrealAiCarousel />
        </div>
      </div>
    </SectionContainer>
  );
};
