import { HOMEASSETS } from '@/assets/home';
import { SectionContainer } from '@/components/molecules/SectionContainer';

export const TrustedCompany = () => {
  const company = [
    HOMEASSETS.TrustCompany2,
    HOMEASSETS.TrustCompany2,
    HOMEASSETS.TrustCompany1,
    HOMEASSETS.TrustCompany1,
    HOMEASSETS.TrustCompany2,
  ];
  return (
    <div className="bg-white w-full z-10 relative">
      <SectionContainer className="py-10 w-full" innerClassName="flex flex-col gap-6">
        <h1
          data-aos="fade-down"
          data-aos-delay={'200'}
          data-aos-offset={'10'}
          className="text-[#191A15] font-bold text-lg  sm:text-40 text-center tracking-tighter sm:leading-[48.1px] capitalize"
        >
          Trusted by 100+ companies over the world
        </h1>

        <div className="flex flex-row gap-10 lg:justify-center items-center flex-wrap">
          {company.map((src, index) => (
            <img
              data-aos="fade-right"
              data-aos-delay={300 * index}
              data-aos-offset={'60'}
              key={'trust-comany' + index}
              src={src}
              className="mobile:w-[135px] object-contain"
            />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};
