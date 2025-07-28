import {
  DavidKimAvatar,
  EmmaRodriguezAvatar,
  HenryLiuAvatar,
  JamesPetersonAvatar,
  MariaGonjalezAvatar,
  MikeJohnsonAvatar,
  RachelLeeAvatar,
  SophiaAvatar,
} from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface IReviewItem {
  idx?: number;
  decription: string;
  name: string;
  designation: string;
  image: string;
}
export const Review = () => {
  const REVIEWS: IReviewItem[] = [
    {
      decription: `Unreal AI's impact on our marketing strategy has been profound, enabling us to launch dynamic campaigns that really resonate with our audience. Our engagement rates have never been higher.`,
      designation: 'CEO of NextGen Apparel',
      name: 'James Peterson',
      image: JamesPetersonAvatar,
    },
    {
      decription: `Thanks to Unreal AI, our customer service has transformed into a 24/7 operation, providing instant, personalized support that has dramatically improved customer satisfaction.`,
      designation: 'CMO of FinTech Innovations',
      name: 'Maria Gonzalez',
      image: MariaGonjalezAvatar,
    },
    {
      decription: `Our sales team has doubled their conversion rate with Unreal AI's lead generation and qualification tools. It's like having a 24/7 assistant for each salesperson.`,
      designation: 'VP of Sales at EcoSolution',
      name: 'Henry Liu',
      image: HenryLiuAvatar,
    },
    {
      decription: `Unreal AI has automated our A/B testing and campaign optimizations, allowing us to achieve unmatched efficiency in our marketing efforts and a significant increase in ROI.`,
      designation: 'Director of Marketing at HealthTrendz',
      name: 'Sophia Chang',
      image: SophiaAvatar,
    },
    {
      decription: `Implementing Unreal AI in our sales processes has streamlined our pipeline and improved lead quality, resulting in higher conversions and a boost in revenue.`,
      designation: 'Chief Sales Officer at TechGlobal',
      name: 'David Kim',
      image: DavidKimAvatar,
    },
    {
      decription: `Our customer service team can now focus on complex issues, thanks to Unreal AI handling routine inquiries. This has led to higher customer retention and satisfaction.`,
      designation: 'Head of Customer Success at LearnBright',
      name: 'Emma Rodriguez',
      image: EmmaRodriguezAvatar,
    },
    {
      decription: `Unreal AI's adaptive marketing algorithms have not only optimized our marketing spend but also ensured that we stay ahead of the curve in reaching our target audience.`,
      designation: 'CTO of SecureData',
      name: 'Mike Johnson',
      image: MikeJohnsonAvatar,
    },
    {
      decription: `With Unreal AI, our small team can deliver personalized customer service and sales follow-ups at scale, something we never thought possible. It's been a game-changer for our business growth and customer loyalty.`,
      designation: 'CEO of GourmetDelights',
      name: 'Rachel Lee',
      image: RachelLeeAvatar,
    },
  ];
  return (
    <div className=" w-full sm:py-[80px] py-10 lg:pb-[150px] bg-[#252636]">
      <Carousel className="flex flex-col gap-10">
        <SectionContainer>
          <div className="w-full flex flex-row justify-between gap-5 items-center">
            <h1 className=" font-roboto text-white capitalize text-xl font-bold sm:text-40 tracking-tighter relative z-10">
              Because they love us
            </h1>
            <div className="flex flex-row gap-5 justify-end items-center ">
              <div className="relative sm:w-20 w-16 flex">
                <CarouselPrevious className="carousel-button bg-transparent border border-purple-500 hover:border-purple-500 hover:bg-purple-500 hover:text-white text-purple-500 text-4xl w-12 h-12 absolute top-1/2 -translate-y-1/2 right-" />
                <CarouselNext className="carousel-button bg-transparent border border-purple-500 hover:border-purple-500 hover:bg-purple-500 text-purple-500 hover:text-white   w-12 h-12 absolute top-1/2 -translate-y-1/2 right-0" />
              </div>
            </div>
          </div>
        </SectionContainer>
        <div className="relative">
          <SectionContainer>
            <div className="bg-love-us-gradient rounded-lg h-[300px] "></div>
          </SectionContainer>
          <CarouselContent className="small:h-[200px] h-[300px] w-full gap-5 ml-5 mr-10 absolute top-20">
            {REVIEWS.map((el, index) => (
              <ReviewItem {...el} idx={index} key={el.name + index} />
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </div>
  );
};

const ReviewItem = ({ decription, designation, idx, name, image }: IReviewItem) => {
  return (
    <CarouselItem className=" h-full bg-white shadow-lg small:max-w-[350px] max-w-[384px] rounded-lg small:p-4 p-8 flex flex-col justify-between">
      <p data-aos={'zoom-in-up'} data-aos-delay={150 * idx!} className="line-clamp-6 small:text-sm">
        {decription}
      </p>
      <div data-aos={'zoom-in-up'} data-aos-delay={120 * idx!} className="flex flex-row gap-5">
        <img src={image} alt="review-avatar" className="w-12 h-12 rounded-full object-cover" />
        <div data-aos={'zoom-in-up'} data-aos-delay={110 * idx!} className="flex flex-col">
          <h1 className="small:text-base text-lg text-black font-semibold">{name}</h1>
          <p className="small:text-sm text-base text-gray-600 font-normal">{designation}</p>
        </div>
      </div>
    </CarouselItem>
  );
};
