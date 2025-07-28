import { CustomerServiceImage, DualityChatBotAiImage } from '@/assets/images';

import { SectionContainer } from '../molecules/SectionContainer';
import { SectionHeading } from './SectionHeading';

export const WhatIsDuality = () => {
  return (
    <SectionContainer id="what-is-duality" className="py-80.1 mobile:py-10">
      <div className="gap-20 flex flex-col">
        <SectionHeading
          className="px-28 mobile:px-0"
          heading="What is Duality AI?"
          subHeading={`  In the age of instant gratification, every second your visitor waits can be a lost
          opportunity. Duality AI bridges this gap. By harnessing your website's information and any
          other textual resources you provide, Duality AI crafts a chatbot designed for success –
          turning casual visitors into loyal customers.`}
        />
        <div className="grid grid-cols-2 mobile:grid-cols-1">
          <div className="border-r-2 mobile:border-b-2 mobile:border-b-purple-400 mobile:border-r-0 border-r-purple-400 p-6 flex flex-col gap-5">
            <img
              src={CustomerServiceImage}
              alt=""
              className=""
              data-aos="fade-up"
              data-aos-offset={'0'}
              data-aos-delay={'100'}
            />
            <h1
              className="text-2xl font-medium text-center"
              data-aos="zoom-in"
              data-aos-offset={'0'}
              data-aos-delay={'200'}
            >
              Traditional Customer Service
            </h1>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <img
              src={DualityChatBotAiImage}
              alt=""
              className=""
              data-aos="fade-up"
              data-aos-offset={'0'}
              data-aos-delay={'100'}
            />
            <h1
              className="text-2xl font-medium text-center"
              data-aos="zoom-in"
              data-aos-offset={'0'}
              data-aos-delay={'200'}
            >
              Duality AI Customer Service
            </h1>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
