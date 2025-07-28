import { ArrowLeft, ArrowRight } from 'lucide-react';

import { PersonImage } from '@/assets/images';

import { SectionContainer } from '../molecules/SectionContainer';
import { Button } from '../ui/button';
import { SectionHeading } from './SectionHeading';

export const LoveAndTrust = () => {
  return (
    <SectionContainer id="love-and-trust" className="love-trust-bg py-80.1 mobile:py-10">
      <div className="flex flex-col gap-10">
        <SectionHeading
          heading="Loved & Trusted"
          className="text-left flex flex-row justify-start"
        />
        <div className="flex flex-col gap-5">
          <div className="flex flex-row justify-end gap-5 items-center">
            <Button variant={'ghost'} size={'icon'}>
              <ArrowLeft size={40} />
            </Button>
            <Button variant={'ghost'} size={'icon'}>
              <ArrowRight size={40} />
            </Button>
          </div>
          <div className="grid grid-cols-3 mobile:grid-cols-1 gap-5">
            <div data-aos="fade-up" data-aos-offset={'0'} data-aos-delay={'100'}>
              <LoveAndTrustCard />
            </div>
            <div data-aos="fade-up" data-aos-offset={'0'} data-aos-delay={'200'}>
              <LoveAndTrustCard />
            </div>
            <div data-aos="fade-up" data-aos-offset={'0'} data-aos-delay={'300'}>
              <LoveAndTrustCard />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

const LoveAndTrustCard = () => {
  return (
    <div className=" pt-[30px] md:pb-[18px] flex flex-col gap-[30px] pr-[30px] border-r-2 border-t-2 border-black rounded-tr-[33px]">
      <p className="text-white text-base">
        <iframe
          width="100%"
          height="280px"
          src="https://www.youtube.com/embed/_m6vnjRbNPU?si=V7gXNgGkWzAqrOGO"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </p>
      <div className=" flex gap-[12px] items-center">
        <img src={PersonImage} className="rounded-full object-cover w-[44px] h-[44px]" />
        <div>
          <span className="text-black text-sm font-medium">Talisha Brantley</span>
          <p className="text-black/60  text-xs">Founder/Chief Executive Officer, Credentials</p>
        </div>
      </div>
    </div>
  );
};
