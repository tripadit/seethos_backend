import { HOMEASSETS } from '@/assets/home';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <div className="w-full bg-dark-100 relative">
      <div className="hero-line-pattern-bg  w-full h-full relative z-10">
        <SectionContainer id="hero" className="py-80.1 h-full" innerClassName="h-full flex-1">
          <div className="flex flex-col flex-1 w-full  justify-between h-full gap-80.1">
            <div className="flex xl:flex-row flex-col w-full sm:pt-80.1 h-full flex-1 items-center justify-center gap-5">
              {/* <div className="xl:max-h-[344px]  xl:max-w-[592px] w-full flex flex-col h-full flex-1 items-center justify-center">
                <BusinessItem
                  isHeroSection
                  topSectionClassName="tablet:justify-center tablet:items-center mobile:justify-center mobile:items-center"
                  headingClassName=" md:leading-[45px] xl:leading-[58px] text-3xl sm:text-[48px] xl:text-left text-center"
                  title="Our AI Engines Power Your Sales and Marketing"
                  subTitle="Unleash the Power of AI and Human Expertise"
                />
              </div>
              <img
                src={HOMEASSETS.HeroRightImage}
                className="xl:w-[600px] xl:h-[493px] object-cover"
              /> */}
              <a href="https://waitlist.unrealai.co" target="_blank" referrerPolicy="origin">
                <Button
                  className=""
                  data-aos="fade-up"
                  data-aos-delay={'400'}
                  data-aos-offset={'0'}
                  variant={'unrealPrimaryBtn'}
                  size={'lg'}
                  type="submit"
                >
                  Join Our Waitlist
                </Button>
              </a>
            </div>
            {/* <div
              className="w-full border lg:h-[522px]  px-5 py-10 flex flex-col items-center gap-10  rounded-xl  bg-white  bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10  border-white/40
              "
            >
              <h1 className="text-white font-medium text-xl sm:text-32 tracking-[-1px] text-center">
                Find Out why UNREAL AI stands out from the rest
              </h1>
              <div className="flex lg:flex-row gap-10 flex-col flex-1 w-full justify-between sm:px-5 h-full lg:h-[369.4px]">
                <img
                  src={HOMEASSETS.HomeScreenVideoImage}
                  className="max-w-[600px] w-full h-[400.4px]"
                  lg:h-[369.4px] lg:max-w-[500px]
                />
                <div className="sm:h-[390px] h-[450px]  w-full  bg-white rounded-xl ">
                  <Chatbot showImages={false} isSmall={true} />
                </div>
              </div>
            </div> */}
          </div>
        </SectionContainer>
      </div>

      <img src={HOMEASSETS.HomeLinePattern} className="absolute bottom-0 right-0 w-screen" />
      <img src={HOMEASSETS.HomeRightOvalPattern} className="absolute top-0 left-0" />
    </div>
  );
};
