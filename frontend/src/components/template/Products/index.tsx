import { PRODUCT_RESTAURANT } from '@/assets/animation';
import {
  BadgeIcon,
  PiggyBank,
  SandBoxIcon,
  SquaresIcon,
  StarIcon,
  ThumbsUpIcon,
} from '@/assets/icons';
import { BusinessImg, RestaurantBotImg, RobotWaiter } from '@/assets/images';
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

const Products = () => {
  const featureItems: IFeatureItems[] = [
    {
      heading: 'Personalized Customer Experience',
      decription: `Enhance your guests' dining experience with personalized recommendations. Our AI learns from customer behavior and preferences to suggest dishes, drinks, and customizations, making every visit unique and memorable.`,
      animation: PRODUCT_RESTAURANT.PersonalizedExperience,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      style: {
        position: 'relative',
      },
      buttonText: 'Craft Memorable Experiences with AI',
    },
    {
      heading: 'Efficient Order Processing and Kitchen Management',
      decription: `Streamline the order-to-table process with Unreal AI. Our technology ensures orders are communicated effectively between the front of the house and the kitchen, reducing errors and speeding up service. Keep your kitchen running smoothly, even during the busiest hours.`,
      animation: PRODUCT_RESTAURANT.OrderProcessing,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      isReverse: true,
      style: {
        position: 'relative',
      },
      buttonText: 'Optimize Your Kitchen with Unreal AI',
    },
    {
      heading: 'Insightful Analytics and Reporting',
      decription: `Gain deep insights into your restaurant's performance with Unreal AI's analytics. From customer feedback to sales data, our comprehensive reporting tools help you make informed decisions, identify opportunities for growth, and continuously improve your operations.`,
      animation: PRODUCT_RESTAURANT.InsightFullAnaly,
      imageClassName: 'bottom-[7px] -left-1',
      height: 700,
      width: 650,
      style: {
        position: 'relative',
      },
      buttonText: 'Elevate Your Restaurant with AI Analytics',
    },
  ];

  const whyUs = [
    {
      title: 'Industry Expertise',
      description:
        'With years of experience in AI technology and the restaurant industry, Unreal AI understands the unique challenges and opportunities of restaurant operations. Our team of experts is dedicated to delivering tailored solutions that meet the specific needs of restaurant owners.',
      icon: StarIcon,
    },
    {
      title: 'Cutting-Edge Technology',
      description:
        'Unreal AI leverages the latest advancements in AI, machine learning, and natural language processing to develop innovative solutions that drive business success. Our technology stack ensures unparalleled performance, reliability, and scalability for restaurant businesses.',
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
        'Trusted by leading restaurants worldwide, Unreal AI has a proven track record of success in implementing AI solutions that deliver real results. From increased customer satisfaction to improved operational efficiency, our solutions have helped restaurants achieve remarkable outcomes.',
      icon: BadgeIcon,
    },
    {
      title: 'Comprehensive Support',
      description:
        'At Unreal AI, we provide comprehensive support every step of the way. From initial consultation to implementation and beyond, our dedicated team is committed to ensuring the success of your restaurant. We offer personalized assistance, ongoing training, and regular updates to maximize the value of our solutions for your business.',
      icon: ThumbsUpIcon,
    },
    {
      title: 'Intelligent CRM',
      description:
        'Empower restaurant owners with actionable insights and personalized customer management through our intelligent CRM system. Track customer preferences, manage reservations and orders, and drive customer loyalty with targeted marketing campaigns.',
      icon: SquaresIcon,
    },
  ];

  return (
    <div>
      <SectionContainer className="restaurant-container min-h-[650px] small:h-full small:py-12 mt-[80px]  sm:max-h-screen w-full sm:mt-[84px] ">
        <div className="small:flex-col-reverse flex items-center h-full gap-10 w-full justify-center">
          <div className="max-w-[740px] flex flex-col gap-2.5">
            <h4 className="small:text-32 text-[36px] font-bold capitalize leading-10 text-white">
              Unreal AI in Restaurants: revolutionizing the Dining Experience
            </h4>
            <p className="small:text-sm text-base text-white">
              Welcome to a new era of dining where innovation meets the culinary world. Unreal AI is
              proud to introduce its cutting-edge AI solutions, specifically tailored for the
              restaurant industry.{' '}
            </p>
            <Button
              variant={'unrealPrimary'}
              className="w-fit small:mt-5 mt-10"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Get started with unreal AI
            </Button>
          </div>
          <div className="text-white">
            <img src={RobotWaiter} alt="" className="small:w-[250px]" />
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="py-80.1 why-choose-restaurant">
        <h3 className="small:text-32 text-[40px] font-bold small:mb-5 mb-10">
          Why Choose Unreal AI for Your Restaurant?
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
        className="restaurant-ready-to-experience"
      />
      <SectionContainer id="transform-factory" className="py-80.1 mobile:py-10 transform-factory">
        <div className=" flex small:flex-col-reverse justify-between items-center gap-10">
          <div className="small:flex small:flex-col  flex flex-col small:items-center small:justify-center max-w-[800px]">
            <h1 className="small:text-[26px] small:font-bold mb-2.5 small:leading-10 small:mb-4  capitalize small:text-center text-52 font-semibold  leading-[62px] text-white">
              Transform Your Restaurant Experience with AI
            </h1>
            <p className="text-white text-base small:text-sm mb-4">
              Ready to revolutionize your restaurant operations? Contact us today to learn how
              Unreal AI's AI solutions can take your restaurant to the next level.
            </p>
            <Button
              className=" bg-white w-max text-unrealPrimary font-semibold leading-6"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Try Out Unreal AI
            </Button>
          </div>
          <img src={BusinessImg} alt="ready-to-elevate-business" />
        </div>
      </SectionContainer>
      <BenifitsJoining
        useLeftSection={false}
        children={<img src={RestaurantBotImg} alt="restaurant-bot" className="w-full h-full" />}
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

export default Products;
