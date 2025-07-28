import { useMixpanel } from 'react-mixpanel-browser';

import { HOMEASSETS } from '@/assets/home';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { APPMIXPANELV2 } from '@/mixpanel/appMixpanel';

import { BusinessNeedItem, IBusinessNeedItemProps } from './components/businessNeedItem';

export const BusinessNeed = () => {
  const mixpanel = useMixpanel();
  const BUSSINESSNEED: IBusinessNeedItemProps[] = [
    {
      image: HOMEASSETS.Support,
      description: `Our team of experienced developers use the latest technologies and methodologies to deliver high-quality, efficient, and reliable software. From web and mobile applications to complex enterprise systems.`,
      title: 'Support',
      onClick: () => {
        APPMIXPANELV2.hireAgesnt.onClick(mixpanel, 'Hire as a Support Assistant - CTA');
      },
      buttonTitle: 'Hire as a Support Assistant',
    },
    {
      image: HOMEASSETS.Marketing,
      description: `We understand the importance of a seamless user experience and our team of expert developers are dedicated to crafting cutting-edge, visually stunning and intuitive apps. Our team stays up to date on the latest technologies and trends.`,
      title: 'Marketing',
      onClick: () => {
        APPMIXPANELV2.hireAgesnt.onClick(mixpanel, 'Hire as a Marketing Assistant - CTA');
      },
      buttonTitle: 'Hire as a Marketing Assistant',
    },
    {
      image: HOMEASSETS.Sales,
      description: `Our team of experienced developers use the latest technologies and methodologies to deliver high-quality, efficient, and reliable software. From web and mobile applications to complex enterprise systems.`,
      title: 'Sales',
      onClick: () => {
        APPMIXPANELV2.hireAgesnt.onClick(mixpanel, 'Hire as a Sales Assistant - CTA');
      },
      buttonTitle: 'Hire as a Sales Assistant',
    },
  ];
  return (
    <SectionContainer className="bg-dark-100 py-20">
      <div className="flex flex-col gap-10">
        <div className="flex flex-row justify-center">
          <div className="flex flex-col flex-1 justify-center items-center gap-3 max-w-[690px] w-full">
            <h1
              data-aos="fade-up"
              data-aos-delay={'200'}
              data-aos-offset={'0'}
              className="font-bold font-roboto text-white mobile:mt-3 md:leading-[60px] capitalize xl:leading-[67px] mobile:text-3xl text-[56px] text-center tracking-[-1px]"
            >
              All your business needs Catered by UNREAL AI
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={'300'}
              data-aos-offset={'0'}
              className="text-base sm:text-2xl text-center font-normal sm:leading-[33.6px] text-[#8A9BB7]/80 mb-2"
            >
              Now your customer relations can focus on optimization, scale up through automation,
              and manage top-tier clients.
            </p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
          {BUSSINESSNEED.map((item, index) => (
            <BusinessNeedItem key={index + 'business-need'} {...item} index={index} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
