import clsx from 'clsx';

import { QuoteIcon } from '@/assets/icons';
import { GoogleImage, GruhubImage, MicrosoftImage } from '@/assets/images';

import { SectionContainer } from '../molecules/SectionContainer';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { SectionHeading } from './SectionHeading';

export default function AsSeenOn() {
  return (
    <SectionContainer id="as-seen-on" className=" as-seen-on-bg">
      <div className="py-80.1 mobile:py-10">
        <div className="py-20 mobile:py-16 flex flex-row mobile:flex-col gap-10 flex-1 w-full">
          <div className="flex flex-col gap-10 w-[50%] mobile:w-full">
            <SectionHeading
              heading="As Seen on"
              subHeading="Our chatbot mentions in the media"
              headingClassName="mobile:text-left text-center"
              subHeadingClassName="mobile:text-left"
            />
            <div className="flex flex-row mobile:flex-col justify-end">
              <div data-aos="fade-up" data-aos-offset={'0'} data-aos-delay={'100'}>
                <AsSeenOneItem
                  image={GruhubImage}
                  description={`Revolutionizing User Engagement with AI Chatbots" - A featured article on how our AI chatbots are reshaping customer interactions in the digital era.`}
                  className="w-[400px] tablet:max-w-[320px] mobile:w-auto"
                />
              </div>
            </div>
          </div>
          <div className="w-[50%] mobile:w-full flex flex-col gap-10">
            <div data-aos="fade-up" data-aos-offset={'0'} data-aos-delay={'200'}>
              <AsSeenOneItem
                image={GoogleImage}
                description={`Boosting Conversions with AI Chatbots" - A special report on how our integration services are driving success for businesses of all sizes.`}
              />
            </div>
            <div data-aos="fade-up" data-aos-offset={'0'} data-aos-delay={'300'}>
              <AsSeenOneItem
                image={MicrosoftImage}
                description={`The Future of Online Customer Support" - An in-depth interview with our CEO on the potential of AI chatbots in transforming customer support.`}
                className="w-[90%] mobile:w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

const AsSeenOneItem = ({
  className,
  image,
  description,
}: {
  className?: string;
  image: any;
  description: string;
}) => {
  return (
    <Card className={clsx('p-8 gap-5 flex flex-col', className)}>
      <img src={image} alt="" className="object-contain w-32" />
      <div className="flex flex-row gap-2">
        <div>
          <QuoteIcon />
        </div>
        <div className="flex flex-col  items-start">
          <p className="text-base font-normal text-neutral-700">{description}</p>
          <Button variant={'link'} className="px-0 py-0 text-purple-500 ">
            view article
          </Button>
        </div>
      </div>
    </Card>
  );
};
