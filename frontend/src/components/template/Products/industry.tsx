import { INDUSTRY_4 } from '@/assets/animation';
import {
  BadgeIcon,
  BulbIcon,
  PiggyBank,
  SandBoxIcon,
  StarIcon,
  ThumbsUpIcon,
} from '@/assets/icons';
import { BusinessImg, IndustryBotImage, IndustryHeroRightImg } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { BenifitsJoining, FeaturesSection } from '@/components/section/landing';
import { Button } from '@/components/ui/button';
import { IFeatureItems } from '@/constants/appConstants';
import { cn, LANDING_CALENDLY_URL } from '@/lib/utils';

interface IWhyChooseUs {
  icon: any;
  title: string;
  description: string;
  index?: number;
  noContent?: boolean;
}

const IndustrySection = () => {
  const featureItems: IFeatureItems[] = [
    {
      heading: 'Advanced Data Analysis',
      decription: `Unlock actionable insights from your factory data with advanced AI algorithms. Gain real-time visibility into production performance, equipment health, and process efficiency.`,
      animation: INDUSTRY_4.AdvancedDataAnalysis,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      style: {
        position: 'relative',
      },
      buttonText: 'Analyze Data Now',
    },
    {
      heading: 'Predictive Maintenance',
      decription: `Prevent costly downtime and equipment failures with AI-driven predictive maintenance. Identify potential issues before they occur and optimize maintenance schedules for maximum efficiency.`,
      animation: INDUSTRY_4.PredictiveMaintainance,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      isReverse: true,
      style: {
        position: 'relative',
      },
      buttonText: 'Boost Efficiency Now',
    },
    {
      heading: 'Optimized Production Processes',
      decription: `Streamline production workflows and maximize productivity with AI-powered optimization. Identify bottlenecks, streamline workflows, and optimize resource allocation for peak performance.`,
      animation: INDUSTRY_4.OptimizedProduction,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      style: {
        position: 'relative',
      },
      buttonText: 'Maximize Productivity Today',
    },
    {
      heading: 'Smart Decision-Making',
      decription: `Make informed decisions with AI-powered decision support systems. Leverage data-driven insights to optimize production schedules, allocate resources, and drive continuous improvement.`,
      animation: INDUSTRY_4.SmartDecisionMaking,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      isReverse: true,
      style: {
        position: 'relative',
      },
      buttonText: 'Empower Your Choices',
    },
    {
      heading: 'Automated Workflows',
      decription: `Automate repetitive tasks and streamline workflows with Chatbots and LLMs. Enhance operational efficiency, improve communication, and empower your workforce to focus on strategic initiatives.`,
      animation: INDUSTRY_4.AutomatedWorkflow,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      style: {
        position: 'relative',
      },
      buttonText: 'Maximize Productivity Today',
    },
  ];

  const whyUs = [
    {
      title: 'Industry Expertise',
      description:
        'With years of experience in AI technology and manufacturing, Unreal AI understands the unique challenges and opportunities of Industry 4.0. Our team of experts is dedicated to delivering tailored solutions that meet the specific needs of manufacturers.',
      icon: StarIcon,
    },
    {
      title: 'Cutting-Edge Technology',
      description:
        'Unreal AI leverages the latest advancements in AI, LLMs, and Chatbots to drive innovation and excellence in factory operations. Our advanced technology stack ensures unparalleled performance, reliability, and scalability.',
      icon: SandBoxIcon,
    },
    {
      title: '',
      description: '',
      icon: PiggyBank,
      noContent: true,
    },
    {
      title: 'Proven Track Record',
      description:
        'Trusted by leading manufacturers worldwide, Unreal AI has a proven track record of success in implementing Industry 4.0 solutions. From predictive maintenance to automated workflows, our solutions have helped businesses achieve remarkable results.',
      icon: BadgeIcon,
    },
    {
      title: 'Comprehensive Support',
      description:
        ' At Unreal AI, we provide comprehensive support every step of the way. From initial consultation to implementation and beyond, our dedicated team is committed to ensuring the success of your Industry 4.0 initiatives.',
      icon: ThumbsUpIcon,
    },
    {
      title: 'Future-Proof Solutions',
      description:
        'With rapid advancements in technology, Unreal AI offers future-proof solutions that evolve with your business. Our flexible and scalable platform adapts to changing needs and emerging trends, ensuring your factory remains at the forefront of innovation.',
      icon: BulbIcon,
    },
  ];

  return (
    <div>
      <SectionContainer
        innerClassName=""
        className="relative industry-container min-h-[650px] small:h-full small:py-12 mt-[80px]  sm:max-h-screen w-full sm:mt-[84px] "
      >
        <div className=" small:flex-col-reverse flex items-center h-full gap-10 w-full small:justify-center">
          <div className=" flex flex-col gap-2.5 max-w-[621px]">
            <h4 className="small:text-32 text-[56px] font-bold capitalize small:leading-snug leading-[67px] text-white">
              Revolutionize Your Factory Operations with Industry 4.0
            </h4>
            <p className="small:text-sm text-base text-white/90">
              Embrace the Future of Manufacturing with Unreal AI
            </p>
            <Button
              className="w-fit bg-white text-unrealPrimary small:mt-5 mt-5"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Learn More
            </Button>
          </div>
        </div>
        <img
          src={IndustryHeroRightImg}
          alt="industry-img"
          className=" h-full object-cover top-0 max-w-[50vw] w-full  absolute right-0 small:hidden"
        />
      </SectionContainer>
      <SectionContainer className="py-80.1 ">
        <h3 className="small:text-32 text-[40px] font-bold small:mb-5 mb-10">
          Why Choose Unreal AI for Industry 4.0?
        </h3>
        <div className="grid grid-cols-3 small:flex small:flex-col gap-8">
          {whyUs.map((el, idx) => (
            <WhyChooseUs {...el} index={idx} key={idx} />
          ))}
        </div>
      </SectionContainer>
      <FeaturesSection
        features={featureItems}
        title="Ready to Experience Unreal AI?"
        className=""
      />
      <SectionContainer id="transform-factory" className="py-80.1 mobile:py-10 transform-factory">
        <div className=" flex small:flex-col-reverse justify-between items-center gap-10">
          <div className="small:flex small:flex-col  flex flex-col small:items-center small:justify-center max-w-[800px]">
            <h1 className="small:text-[26px] small:font-bold mb-2.5 small:leading-10 small:mb-4  capitalize small:text-center text-52 font-semibold  leading-[62px] text-white">
              Transform Your Factory with Industry 4.0
            </h1>
            <p className="text-white text-base small:text-sm mb-4">
              Ready to unlock the full potential of Industry 4.0? Contact us today to learn how
              Unreal AI can revolutionize your factory operations.
            </p>
            <Button
              className=" bg-white w-max text-unrealPrimary font-semibold leading-6"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Try Out Unreal AI
            </Button>
          </div>
          useChatbot();
          <img src={BusinessImg} alt="ready-to-elevate-business" />
        </div>
      </SectionContainer>
      <BenifitsJoining
        useLeftSection={false}
        children={<img src={IndustryBotImage} alt="restaurant-bot" className="w-full h-full" />}
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

export default IndustrySection;
