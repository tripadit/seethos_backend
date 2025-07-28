import { MailIcon } from 'lucide-react';

import { SectionContainer } from '../molecules/SectionContainer';
import { Button } from '../ui/button';
import { SectionHeading } from './SectionHeading';

export const BookADemo = () => {
  return (
    <SectionContainer id="book-a-demo" className="book-a-demo  py-80.1 mobile:py-10">
      <div className="flex flex-col justify-center items-center gap-10">
        <SectionHeading
          className="max-w-800"
          heading=" Book a free Demo"
          subHeadingClassName="text-black/70 mobile:text-sm"
          subHeading={`Book a personalized demo to experience how our cutting-edge technology can transform your website's user engagement and boost conversions.`}
        />
        <Button
          variant={'gradient'}
          data-aos="fade-up"
          data-aos-offset={'0'}
          data-aos-delay={'100'}
          onClick={() => window.open('https://calendly.com/ujjwalroy/30min', '_blank')}
        >
          Book free consultation <MailIcon />
        </Button>
      </div>
    </SectionContainer>
  );
};
