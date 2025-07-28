import loadable from '@loadable/component';
import { Mail, MapPin, PhoneCall } from 'lucide-react';

const Lottie = loadable(() => import('react-lottie'));

import { ABOUT_US } from '@/assets/animation';
import { SandBoxIcon, ScalebuildDarkCircleLogo, StarIcon, TrophyIcon } from '@/assets/icons';
import { AWSImage, BusinessImg } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { BenifitsJoining } from '@/components/section/landing';
import { Button } from '@/components/ui/button';
import { cn, LANDING_CALENDLY_URL } from '@/lib/utils';

interface IWhyChooseUs {
  icon: any;
  title: string;
  description: string;
  index?: number;
  noContent?: boolean;
}

const AboutUsSection = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
  };

  const whyUs = [
    {
      title: 'Expertise',
      description:
        'Our team comprises leading AI researchers, developers, and industry experts committed to delivering excellence.',
      icon: SandBoxIcon,
    },
    {
      title: 'Innovation',
      description: `We're at the forefront of AI research and development, ensuring our solutions leverage the latest technologies and methodologies.`,
      icon: StarIcon,
    },
    {
      title: 'Results',
      description:
        'At Unreal AI, success is measured by the tangible results we deliver for our clients, from increased efficiency and cost savings to enhanced customer satisfaction and revenue growth.',
      icon: TrophyIcon,
    },
  ];

  return (
    <div>
      <SectionContainer className="relative about-us-container min-h-[650px] small:h-full small:py-12 mt-[80px]  sm:max-h-screen w-full sm:mt-[84px] ">
        <div className=" small:flex-col-reverse flex items-center h-full gap-10 w-full small:justify-center">
          <div className=" flex flex-col gap-2.5 max-w-[621px]">
            <h4 className="small:text-32 text-[48px] font-bold capitalize small:leading-snug leading-[67px] text-[#1F1F1F]">
              Welcome To Unreal AI
            </h4>
            <p className="small:text-sm text-base text-[#374151]">
              At Unreal AI, we're pioneering the future of business automation and intelligence.
              Founded in 2023 by a team of visionary technologists and entrepreneurs, we've set out
              on a mission to transform how businesses operate, compete, and thrive in the digital
              era. Our headquarters are located in Raleigh, NC, a hub for innovation and technology,
              where we're constantly inspired to push the boundaries of what's possible with
              artificial intelligence.
            </p>
            <Button
              variant={'unrealPrimary'}
              className="w-fit small:mt-5 mt-5"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Get Started Today
            </Button>
          </div>

          <div className="features-farme">
            <Lottie
              options={{
                ...defaultOptions,
                animationData: ABOUT_US.AboutUsHero,
              }}
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="py-5 partners ">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-[48px] font-extrabold text-white">Our Partners</h3>
          <div className="flex items-center gap-12">
            <div className="w-20 h-20 rounded-2xl p-3 bg-white flex items-center justify-center">
              <img src={AWSImage} alt="aws" />
            </div>
            <div className="w-20 h-20 rounded-2xl p-3 bg-white flex items-center justify-center">
              <img src={AWSImage} alt="aws" />
            </div>
            <div className="w-20 h-20 rounded-2xl p-3 bg-white flex items-center justify-center">
              <ScalebuildDarkCircleLogo className="w-full h-full" />
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer
        className="py-80.1 about-us-container"
        innerClassName="flex items-center justify-between small:flex-col"
      >
        <div>
          <Lottie
            options={{
              ...defaultOptions,
              animationData: ABOUT_US.OurMission,
            }}
          />
        </div>
        <div className="max-w-[682px] flex flex-col gap-6">
          <h3 className="text-[48px] small:text-32 font-bold">Our Mission</h3>
          <p className="text-base font-normal small:text-sm">
            Our mission is simple yet ambitious: to empower businesses of all sizes to unlock their
            full potential through the power of AI. We believe in a future where every business,
            regardless of its size or industry, can leverage AI to enhance efficiency, drive growth,
            and deliver exceptional customer experiences. At Unreal AI, we're making that future a
            reality today.
          </p>
        </div>
      </SectionContainer>

      {/* Why choose unreal */}
      <SectionContainer className="py-80.1 ">
        <h3 className="small:text-32 text-[40px] font-bold small:mb-5 mb-10">
          Why Choose Unreal AI?
        </h3>
        <div className="grid grid-cols-3 small:flex small:flex-col gap-8">
          {whyUs.map((el, idx) => (
            <WhyChooseUs {...el} index={idx} key={idx} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer
        id="transform-factory"
        className="py-80.1 small:py-10 mobile:py-10 transform-factory"
      >
        <div className=" flex small:flex-col-reverse justify-between items-center gap-10">
          <div className="small:flex small:flex-col  flex flex-col small:items-center small:justify-center max-w-[800px]">
            <h1 className="small:text-[26px] small:font-bold mb-2.5 small:leading-10 small:mb-4  capitalize small:text-center text-52 font-semibold  leading-[62px] text-white">
              Join us on this exciting journey
            </h1>
            <p className="text-white text-base small:text-sm mb-4">
              Sign up now and take your business to the next level with AI-powered automation.
            </p>
            <Button
              className=" bg-white w-max text-unrealPrimary font-semibold leading-6"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Get Started Today
            </Button>
          </div>
          <img src={BusinessImg} alt="ready-to-elevate-business" />
        </div>
      </SectionContainer>

      {/* <FeaturesSection features={featureItems} title="Ready to Experience Unreal AI?" className="" /> */}

      <BenifitsJoining
        useLeftSection={false}
        children={
          <div>
            <div className="flex flex-col gap-3 px-24 small:px-0">
              <div className="flex flex-col gap-2.5 ">
                <h4 className="text-32 font-bold">Looking Ahead</h4>
                <p className="text-lg small:text-sm font-normal mb-4">
                  The journey of Unreal AI is just beginning. As we continue to grow and evolve, our
                  commitment to helping businesses navigate the complexities of the digital age
                  remains unwavering.
                </p>
                <p className="text-lg small:text-sm font-normal">
                  We're excited about the future of AI and its potential to revolutionize
                  industries, and we're committed to being at the forefront of this transformation,
                  driving innovation, and delivering value for our clients.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 ">
                <h4 className="text-32 font-bold">Contact Us</h4>
                <p>
                  Ready to explore what Unreal AI can do for your business? Get in touch with our
                  team today.
                </p>
              </div>
              <div className="flex small:flex-col small:gap-3 small:mb-10 small:items-start items-center mt-10 gap-1 justify-between ">
                <div className="flex items-center gap-2">
                  <PhoneCall />
                  <p>+1 919 576 6153</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail />
                  <p>contact@unrealai.co</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin />
                  <div>
                    <p>Raleigh,</p>
                    <p> North Carolina, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

const WhyChooseUs = (props: IWhyChooseUs) => {
  const { description, icon: Icon, title, index = 1, noContent } = props;
  return (
    <div
      className={cn(
        'flex flex-col small:p-0 p-5 rounded-xl  cursor-pointer border-b-4 border-transparent',
        { 'small:hidden': title === '' },
      )}
      data-aos="fade-up"
      data-aos-offset={'0'}
      data-aos-delay={100 * index}
    >
      <div
        className={cn(
          ' flex flex-col small:mb-2 mb-8 justify-center shadow-sm items-center bg-white rounded-lg w-[60px] h-[60px] ',
          { hidden: noContent },
        )}
      >
        <Icon />
      </div>
      <h1 className=" text-2xl font-bold text-neutral-900 small:mb-2 mb-4">{title}</h1>
      <p className="small:text-sm text-base font-normal  text-neutral-700">{description}</p>
    </div>
  );
};

export default AboutUsSection;
