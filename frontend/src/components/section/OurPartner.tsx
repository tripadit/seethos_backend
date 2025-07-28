import { AWSImage, OurPartnerImage } from '@/assets/images';

import { SectionContainer } from '../molecules/SectionContainer';

export const OurPartner = () => {
  return (
    <SectionContainer id="our-partner" className="bg-purple-900 py-80.1 mobile:py-10">
      <div className="flex flex-col gap-10 items-center justify-center">
        <h1 className="font-bold text-48 capitalize text-white text-center">Our Partners</h1>
        <div className="flex flex-row justify-start items-center gap-10">
          <PartnersItem
            image={AWSImage}
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'100'}
          />
          <PartnersItem
            image={OurPartnerImage}
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'200'}
          />
          <PartnersItem
            image={OurPartnerImage}
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'300'}
          />
        </div>
      </div>
    </SectionContainer>
  );
};

const PartnersItem = ({ image, ...args }: { image: any; [key: string]: any }) => {
  return (
    <div
      className="w-20 h-20 rounded-md bg-white flex flex-row justify-center items-center"
      {...args}
    >
      <img src={image} />
    </div>
  );
};
