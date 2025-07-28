import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { SectionContainer } from '@/components/molecules/SectionContainer';
import { APPCONTENT } from '@/utils/constants';

export const TermsOfServiceSection = () => {
  const { TERMSOFSERVICE_PAGE } = APPCONTENT;
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <SectionContainer className="mt-[84px]">
      <div className="mt-[50px] ">
        <h2 className="text-[40px] mobile:text-[32px] tablet:text-[32px] font-bold leading-60 text-black">
          {TERMSOFSERVICE_PAGE.title}
        </h2>
        <span className="text-[16px] mobile:text-[14px] tablet:text-[16px] text-black">
          {TERMSOFSERVICE_PAGE.last_updated}
        </span>
      </div>

      <div className="flex mobile:flex-col-reverse gap-[25px] mt-[50px] items-start">
        <div>
          <h3 className="text-[32px] mobile:text-[24px] tablet:text-[28px] header-gradient-text font-bold  ">
            Introduction
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px] text-black">
            Welcome to Unreal AI. These terms and conditions outline the rules and regulations for
            the use of Unreal AI's website, located at{' '}
            <Link
              to="https://www.unrealai.co"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.unrealai.co
            </Link>
          </p>
          <p className="text-[18px] mt-4 mobile:text-[14px] tablet:text-[16px] text-black">
            By accessing this website, we assume you accept these terms and conditions. Do not
            continue to use Unreal AI if you do not agree to take all of the terms and conditions
            stated on this page.
          </p>
        </div>
      </div>

      <div className="text-gray-900 mt-[50px] flex flex-col gap-[30px] mb-[300px] mobile:mb-[150px] tablet:mb-[150px]">
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px]  font-bold">
            {TERMSOFSERVICE_PAGE.acceptance_of_terms}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.acceptance_of_terms_answer}
          </p>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h4 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {' '}
            {TERMSOFSERVICE_PAGE.restrictions}
          </h4>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.restrictions_answer}
          </p>
          <ul className="list-disc ml-[14px]">
            {TERMSOFSERVICE_PAGE.restrictions_points.map((point, index) => (
              <li key={index} className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {TERMSOFSERVICE_PAGE.registration}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.registration_answer}
          </p>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {TERMSOFSERVICE_PAGE.termination}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.termination_answer}
          </p>
        </div>

        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {TERMSOFSERVICE_PAGE.limitation_of_liability}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.limitation_of_liability_answer}
          </p>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {TERMSOFSERVICE_PAGE.governing_law}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.governing_law_answer}
          </p>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {TERMSOFSERVICE_PAGE.changes_to_agreement}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.changes_to_agreement_answer}
          </p>
        </div>

        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {TERMSOFSERVICE_PAGE.contact_information}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {TERMSOFSERVICE_PAGE.contact_information_answer}
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};
