import { useEffect } from 'react';

import { SectionContainer } from '@/components/molecules/SectionContainer';
import { APPCONTENT } from '@/utils/constants';

export const PrivacyPolicySection = () => {
  const { PRIVACYPOLICY_PAGE } = APPCONTENT;
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <SectionContainer className="mt-[84px]">
      <div className="mt-[50px] ">
        <h2 className="text-[40px] mobile:text-[32px] tablet:text-[32px] font-bold leading-60 text-gray-900">
          {PRIVACYPOLICY_PAGE.title}
        </h2>
        <span className="text-[16px] mobile:text-[14px] tablet:text-[16px] text-gray-900">
          {PRIVACYPOLICY_PAGE.last_updated}
        </span>
      </div>

      <div className="flex mobile:flex-col-reverse gap-[25px] mt-[50px] items-start">
        <div>
          <h3 className="text-[32px] mobile:text-[24px] tablet:text-[28px] header-gradient-text font-bold">
            Introduction
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px] text-gray-900">
            {PRIVACYPOLICY_PAGE.introduction}
          </p>
        </div>
        {/* <img src={ServiceOneImage} alt="" className="w-[309px] h-[253px]" /> */}
      </div>

      <div className="text-gray-900 mt-[50px] flex flex-col gap-[25px] mb-[300px] mobile:mb-[150px] tablet:mb-[150px]">
        <h3 className="text-[32px] mobile:text-[24px] tablet:text-[28px] header-gradient-text font-bold">
          {PRIVACYPOLICY_PAGE.information_we_collect}
        </h3>
        <p className="text-[18px] mobile:text-[14px] tablet:text-[16px] text-gray-900 mt-[20px]">
          {PRIVACYPOLICY_PAGE.information_we_collect_desc}
        </p>
        <div className="flex flex-col gap-[25px]">
          {PRIVACYPOLICY_PAGE.information_we_collect_answer.map((items, idx) => (
            <div className="flex flex-col gap-[10px] mobile:gap-[12px]" key={idx}>
              <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
                {items.title}
              </h3>
              {items.description && (
                <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
                  {items.description}
                </p>
              )}
              <ul className="list-disc ml-[18px]">
                {items.points &&
                  items.points.map((point, idx) => (
                    <li key={idx} className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
                      {point}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
