import loadable from '@loadable/component';

const Lottie = loadable(() => import('react-lottie'));

import { AUTONOMOUS_AUTOMATION } from '@/assets/animation';
import { ClockIconR, CPUChipIcon, LineChart, SandBoxIcon } from '@/assets/icons';
import { BotAutonomousAgent, BotSearch } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';
import { cn, LANDING_CALENDLY_URL } from '@/lib/utils';

interface IWhyChooseUs {
  icon: any;
  title: string;
  description: string;
  index?: number;
  noContent?: boolean;
}

interface IFeatureItems {
  isReversed?: boolean;
  title: string;
  description: string;
  CTALabel: string;
  animation: any;
  className?: string;
  height?: number;
  width?: number;
  style?: any;
}

const AutonomousAgents = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
  };
  // const chatbot = useChatbot();
  const featureItems: IFeatureItems[] = [
    {
      title: 'Customer Support Automation',
      description: `Deliver exceptional customer service with AI-driven support automation. Our assistants can handle inquiries, resolve issues, and provide personalized assistance to customers, ensuring a seamless and satisfying experience.`,
      animation: AUTONOMOUS_AUTOMATION.CustomerSupportAutomation,
      CTALabel: 'Automate your customer support',
      height: 400,
      width: 450,
    },
    {
      title: 'Marketing Automation',
      description: `Enhance your marketing efforts with AI-powered automation. Our assistants can execute targeted marketing campaigns, engage with prospects across multiple channels, and optimize campaign performance for maximum ROI.`,
      animation: AUTONOMOUS_AUTOMATION.MarketingAutomation,
      CTALabel: 'Automate your marketing',
      height: 400,
    },
    {
      title: 'Sales Automation',
      description: `Drive revenue growth and streamline your sales process with custom-trained professional assistants. Our assistants can engage with leads, qualify prospects, and even close deals, freeing up your sales team to focus on high-value activities.`,
      animation: AUTONOMOUS_AUTOMATION.SalesAutomation,
      CTALabel: 'Automate your sales pipeline',
      height: 400,
    },
  ];

  const whyUs = [
    {
      title: 'Cutting-Edge Technology',
      description:
        'Leverage the latest advancements in AI and machine learning to drive business success. Our custom-trained professional assistants are powered by state-of-the-art technology, ensuring unparalleled performance, reliability, and scalability for your business.',
      icon: SandBoxIcon,
    },
    {
      title: 'Customization and Integration',
      description: `Tailor our professional assistants to meet your unique business needs and integrate seamlessly with your existing systems and processes. Whether you need sales support, marketing automation, or customer service assistance, our assistants can be customized to fit your requirements.`,
      icon: CPUChipIcon,
    },
    {
      title: 'bot-search',
      description: ``,
      icon: CPUChipIcon,
    },
    {
      title: '',
      description: '',
      icon: CPUChipIcon,
    },
    {
      title: '24/7 Availability',
      description:
        'Enjoy round-the-clock support and service with our professional assistants. Unlike human employees, our assistants operate 24/7, ensuring prompt and responsive assistance for your customers and uninterrupted productivity for your business.',
      icon: ClockIconR,
    },
    {
      title: 'Data-Driven Decision Making',
      description: `Make informed decisions with actionable insights from our professional assistants. By analyzing data in real-time and providing comprehensive reports on key metrics, our assistants empower you to optimize performance, identify opportunities, and drive business growth.`,
      icon: LineChart,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <SectionContainer className="autonomous-section-container min-h-[850px] h-full small:h-full small:py-12 mt-[80px]  sm:max-h-screen w-full sm:mt-[84px] ">
        <div className="small:flex-col-reverse flex items-center h-full gap-12 w-full justify-center">
          <div className=" flex flex-col gap-2.5 max-w-[560px]">
            <h4 className="small:text-32 text-[48px] font-extrabold capitalize small:leading-snug leading-[67px] text-[#1F1F1F]">
              Connect Your Business to Artificial Intelligence
            </h4>
            <p className="small:text-sm text-2xl text-black">
              Turn your website visitors into customers
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
                animationData: AUTONOMOUS_AUTOMATION.AutonomousAiAgentHero,
              }}
            />
          </div>
        </div>
      </SectionContainer>

      {/* Features */}
      <SectionContainer className="discover-feature-container">
        <SectionContainer className="py-80.1 small:py-5 ">
          <div className="flex flex-col gap-6">
            <h4 className="small:text-32 text-[56px] font-bold capitalize leading-[67px] ">
              Discover Our Features
            </h4>
            <p className="small:text-sm text-base text-[#374151]">
              Our bespoke professional assistants are pioneering a transformation in business
              processes, spanning sales, marketing, customer support, and data analytics. Harnessing
              the capabilities of artificial intelligence, these assistants emulate the performance
              of human employees with enhanced precision, offering round-the-clock service and
              providing instantaneous insights into critical performance metrics.{' '}
            </p>
          </div>
        </SectionContainer>
        <SectionContainer
          className="py-80.1 small:py-5 "
          innerClassName="small:px-0 px-20 flex flex-col gap-10"
        >
          <FeatureItem {...featureItems[0]} />
          <div className="flex small:flex-col mt-4 small:mt-2 gap-8">
            <FeatureItem {...featureItems[1]} isReversed />
            <FeatureItem {...featureItems[2]} isReversed />
          </div>
        </SectionContainer>
        <SectionContainer className="small:py-5">
          <div
            className={cn(
              ' px-20 small:px-3 flex items-center w-full small:flex-col  justify-between rounded-xl ',
            )}
          >
            <div data-aos={'fade-left'} data-aos-delay={300}>
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: AUTONOMOUS_AUTOMATION.SalesAutomation,
                }}
              />
            </div>
            <div className={cn('flex flex-col gap-2.5 max-w-[590px]')}>
              <h2
                data-aos={'fade-right'}
                data-aos-delay={300}
                className="text-4xl small:text-2xl font-bold"
              >
                Data Analysis and Reporting
              </h2>
              <p
                data-aos={'fade-left'}
                data-aos-delay={300}
                className="text-[#374151] small:text-sm text-lg"
              >
                Gain valuable insights into your business with AI-powered data analysis and
                reporting. Our assistants can analyze vast amounts of data, identify trends and
                patterns, and generate real-time reports on key metrics, empowering you to make
                informed decisions.
              </p>
              <Button
                data-aos={'fade-right'}
                data-aos-delay={300}
                variant={'unrealPrimary'}
                className={cn('w-fit mt-1.5 small:mb-10 small:mt-2.5')}
                onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
              >
                Unlock Insights Now!
              </Button>
            </div>
          </div>
        </SectionContainer>
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

      {/* Ready to experiance */}
      <SectionContainer id="transform-factory" className="py-80.1 mobile:py-10 transform-factory">
        <div className=" flex small:flex-col-reverse justify-between items-center gap-10">
          <div className="small:flex small:flex-col  flex flex-col small:items-center small:justify-center max-w-[800px]">
            <h1
              data-aos={'fade-right'}
              data-aos-delay={300}
              className="small:text-[26px] small:font-bold mb-2.5 small:leading-10 small:mb-4  capitalize small:text-center text-52 font-semibold  leading-[62px] text-white"
            >
              Ready to experience the power of Unreal AI Autonomous Professional Assistants?
            </h1>
            <p
              data-aos={'fade-up'}
              data-aos-delay={300}
              className="text-white text-base small:text-sm mb-4"
            >
              Sign up now and take your business to the next level with AI-powered automation.
            </p>
            <Button
              data-aos={'fade-left'}
              data-aos-delay={300}
              className=" bg-white w-max text-unrealPrimary font-semibold leading-6"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Sign Up for AI-Powered Automation!
            </Button>
          </div>
          <img
            data-aos={'fade-right'}
            data-aos-delay={300}
            src={BotAutonomousAgent}
            alt="ready-to-elevate-business"
          />
        </div>
      </SectionContainer>
    </div>
  );
};

const WhyChooseUs = (props: IWhyChooseUs) => {
  const { description, icon: Icon, title, index = 1, noContent } = props;
  return (
    <>
      <div
        className={cn(
          'flex flex-col small:p-0 p-5 rounded-xl cursor-pointer border-b-4 border-transparent',
          { hidden: title === 'bot-search' || title === '' },
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
      <img
        data-aos="fade-up"
        data-aos-offset={'0'}
        data-aos-delay={100 * index}
        src={BotSearch}
        className={cn('mobile:hidden ml-10', { hidden: title !== 'bot-search' })}
      />
      <div className={cn({ hidden: title !== '' })}></div>
    </>
  );
};

const FeatureItem = ({
  isReversed,
  title,
  description,
  CTALabel,
  animation,
  className,
  ...props
}: IFeatureItems) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
  };
  return (
    <div
      className={cn(
        'py-5 px-10 small:px-3 flex items-center w-full small:flex-col  justify-between rounded-xl discover-feature-card',
        className,
        { 'flex-col ': isReversed },
      )}
    >
      <div className={cn('flex flex-col gap-2.5 max-w-[590px]', {})}>
        <h2
          data-aos={'fade-right'}
          data-aos-delay={300}
          className="text-4xl small:text-2xl font-bold"
        >
          {title}
        </h2>
        <p
          data-aos={'fade-left'}
          data-aos-delay={300}
          className="text-[#374151] small:text-sm text-lg"
        >
          {description}
        </p>
        <Button
          data-aos={'fade-right'}
          data-aos-delay={300}
          variant={'unrealPrimary'}
          className={cn('w-fit mt-1.5 small:mb-10 small:mt-2.5', { 'mb-10 mt-2.5': isReversed })}
          onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
        >
          {CTALabel}
        </Button>
      </div>
      <div data-aos={'fade-left'} data-aos-delay={300}>
        <Lottie options={defaultOptions} {...props} />
      </div>
    </div>
  );
};

export default AutonomousAgents;
