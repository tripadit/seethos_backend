import { HOMEASSETS } from '@/assets/home';
import { SectionContainer } from '@/components/molecules/SectionContainer';

import { BusinessItem } from './components/businessItem';

export const ConvertLeads = () => {
  return (
    <SectionContainer className="bg-dark-100 py-20">
      <div className="flex flex-col flex-1 w-full  justify-between h-full gap-10 sm:gap-80.1">
        <div className="flex flex-row justify-center items-center sm:pt-80.1">
          <BusinessItem
            title="Convert all of your missed leads 
            to clients using UNREAL AI"
            headingClassName="capitalize md:leading-[45px] xl:leading-[69px] mobile:text-3xl text-[56px] text-center"
            className="max-w-[900px]"
          />
        </div>
        <img
          data-aos="fade-up"
          data-aos-delay={'500'}
          data-aos-offset={'10'}
          src={HOMEASSETS.DevicesImage}
          className="w-full"
        />
      </div>
    </SectionContainer>
  );
};
