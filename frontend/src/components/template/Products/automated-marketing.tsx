import loadable from '@loadable/component';

import { AUTOMATED_MARKETING } from '@/assets/animation';
import {
  BadgeIcon,
  BatteryCharging,
  ExpandIcon,
  LineChart,
  SandBoxIcon,
  StarIcon,
  ThumbsUpIcon,
  Tool,
} from '@/assets/icons';
import { BusinessImg } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import {
  BenifitsJoining,
  BenifitsJoiningItem,
  FeaturesSection,
} from '@/components/section/landing';
import { Button } from '@/components/ui/button';
import { IFeatureItems } from '@/constants/appConstants';
import { cn, LANDING_CALENDLY_URL } from '@/lib/utils';
const Lottie = loadable(() => import('react-lottie'));
interface IWhyChooseUs {
  icon: any;
  title: string;
  description: string;
  index?: number;
  noContent?: boolean;
}

interface IBenifitItem {
  title: string;
  description: string;
  icon: any;
}

const AutomatedMarketing = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
  };
  const featureItems: IFeatureItems[] = [
    {
      heading: 'Lead Generation',
      decription: `Generate high-quality leads effortlessly with our AI-powered lead generation tools. Our platform scours the web, identifies potential prospects, and delivers qualified leads directly to your inbox.`,
      animation: AUTOMATED_MARKETING.LeadGen,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      style: {
        position: 'relative',
        left: '-46px',
      },
      buttonText: 'Get Leads on Autopilot',
    },
    {
      heading: 'Email Campaigns',
      decription: `Maximize your email marketing efforts with personalized and hyper-targeted email campaigns. Our AI-driven platform analyzes customer data, segments your audience, and delivers tailored messages that resonate with your subscribers.`,
      animation: AUTOMATED_MARKETING.EmailCampaigns,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      isReverse: true,
      style: {
        position: 'relative',
      },
      buttonText: 'Elevate Your Email Marketing!',
    },
    {
      heading: 'Social Media Marketing',
      decription: `Amplify your brand presence and engage with your audience across social media platforms. Our automated social media marketing tools enable you to schedule posts, track performance metrics, and optimize your strategy for maximum impact.`,
      animation: AUTOMATED_MARKETING.SocialMediaMarketing,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      style: {
        position: 'relative',
        left: '-46px',
      },
      buttonText: 'Supercharge Your Social Strategy',
    },
    {
      heading: 'Google Campaigns',
      decription: `Reach potential customers at the moment they're searching for your products or services with Google campaigns. Our AI-powered platform optimizes your ad spend, targets relevant keywords, and maximizes ROI on your Google advertising campaigns.`,
      animation: AUTOMATED_MARKETING.GoogleCampaigns,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      isReverse: true,
      style: {
        position: 'relative',
        // left: '-46px',
      },
      buttonText: 'Start Now',
    },
  ];

  const whyUs = [
    {
      title: 'Industry Expertise',
      description:
        'With years of experience in AI and marketing, our team of experts understands the unique challenges and opportunities of the industry. We leverage our deep industry knowledge to develop innovative solutions that drive real results for our clients.',
      icon: StarIcon,
    },
    {
      title: 'Cutting-Edge Technology',
      description: `Harness the power of AI and machine learning to take your marketing to the next level. Our advanced technology stack ensures unparalleled performance, reliability, and scalability, giving you a competitive edge in today's digital landscape.`,
      icon: SandBoxIcon,
    },
    {
      title: 'Proven Track Record',
      description:
        'Trusted by leading brands worldwide, Unreal AI Automated Marketing has a proven track record of success. From startups to Fortune 500 companies, our solutions have helped businesses of all sizes achieve their marketing goals and drive business growth.',
      icon: BadgeIcon,
    },
    {
      title: 'Comprehensive Support',
      description: `At Unreal AI, we're committed to your success every step of the way. From initial onboarding to ongoing support and training, our dedicated team is here to help you get the most out of our platform. With 24/7 customer support and regular updates, you can trust that we'll be there when you need us.`,
      icon: ThumbsUpIcon,
    },
  ];

  const BENIFITS: IBenifitItem[] = [
    {
      title: 'Increased Efficiency',
      description:
        'Streamline your marketing operations and save valuable time and resources with our automated marketing solutions. ',
      icon: <BatteryCharging />,
    },
    {
      title: 'Enhanced Personalization',
      description:
        'Deliver highly personalized marketing experiences to your audience with our AI-driven platform.',
      icon: <Tool />,
    },
    {
      title: 'Data-Driven Insights',
      description:
        'Gain valuable insights into your marketing performance and audience behavior with our advanced analytics tools.',
      icon: <LineChart />,
    },
    {
      title: 'Scalable Solutions',
      description: `Whether you're a small business or a large enterprise, our automated marketing solutions are designed to scale with your needs.`,
      icon: <ExpandIcon />,
    },
  ];

  return (
    <div>
      <SectionContainer className="automated-marketing-container min-h-[850px] h-full small:h-full small:py-12 mt-[80px]  sm:max-h-screen w-full sm:mt-[84px] ">
        <div className="small:flex-col-reverse flex items-center h-full gap-12 w-full justify-center">
          <div className=" flex flex-col gap-2.5 max-w-[560px]">
            <h4 className="small:text-32 text-[48px] font-bold capitalize small:leading-snug leading-[56px] text-black">
              Marketing Automation is Here! Implement Unreal AI on your Business Today.
            </h4>
            <p className="small:text-sm text-base text-[#606060]">
              Transform Your Marketing Efforts with AI-Powered Solutions
            </p>
            <Button
              variant={'unrealPrimary'}
              className="w-fit small:mt-5 mt-5"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Get Started Today
            </Button>
          </div>
          <div>
            <Lottie
              options={{
                ...defaultOptions,
                animationData: AUTOMATED_MARKETING.AutomatedMarketingHero,
              }}
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="pt-80.1 small:py-5">
        <div className="flex flex-col gap-6 small:gap-3">
          <h4 className="small:text-32 text-[56px] font-bold capitalize leading-[67px] small:leading-snug ">
            About Unreal AI
          </h4>
          <p className="small:text-sm text-base text-[#374151]">
            Welcome to Unreal AI Automated Marketing, where innovation meets efficiency. Our
            AI-powered marketing solutions revolutionize the way businesses reach and engage with
            their audience. From lead generation to personalized campaigns, our automated marketing
            platform streamlines your marketing efforts and drives tangible results. Discover how
            Unreal AI can supercharge your marketing strategy and accelerate business growth.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer className="py-80.1 small:py-5">
        <h3 className="small:text-32 text-[40px] small:leading-tight font-bold small:mb-5 mb-10">
          Why Choose Unreal AI Automated Marketing?
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
              Automate Your Business
            </h1>
            <p className="text-white text-base small:text-sm mb-4">
              Ready to take your marketing to the next level? Sign up for Unreal AI Automated
              Marketing today and transform your marketing strategy with the power of AI.
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
      <FeaturesSection features={featureItems} title="Ready to Experience Unreal AI?" />
      <BenifitsJoining
        useLeftSection={false}
        children={
          <div className="flex flex-col gap-5 flex-1 justify-center small:mb-10">
            <h1 className="text-32 font-semibold capitalize text-neutral-900 ">
              Benefits of joining us
            </h1>
            <div className="grid grid-cols-2 small:flex small:flex-col gap-10">
              {BENIFITS.map((el) => (
                <BenifitsJoiningItem {...el} key={el.title} />
              ))}
            </div>
          </div>
        }
      ></BenifitsJoining>
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

export default AutomatedMarketing;
