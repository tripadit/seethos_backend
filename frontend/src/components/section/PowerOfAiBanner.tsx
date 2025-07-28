import { SectionContainer } from '../molecules/SectionContainer';

export const PowerOfAiBanner = () => {
  return (
    <SectionContainer id="banner" className="bg-primary-gradient py-80.1 mobile:py-10">
      <div className="px-40 tablet:px-10 mobile:px-0 flex flex-col gap-10">
        <h1
          data-aos="zoom-in"
          data-aos-offset={'0'}
          data-aos-delay={'100'}
          className="font-bold text-48 tablet:text-38 mobile:text-lg capitalize text-white text-center"
        >
          Ready to Unleash the Power of AI. Start with Duality Today
        </h1>
        <p
          data-aos="zoom-in"
          data-aos-offset={'0'}
          data-aos-delay={'200'}
          className={'text-lg mobile:text-sm font-normal  text-white text-center'}
        >
          Subscribe today for a comprehensive consultation.
        </p>
      </div>
    </SectionContainer>
  );
};
