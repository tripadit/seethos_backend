import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { SectionContainer } from '@/components/molecules/SectionContainer';
import { APPCONTENT } from '@/utils/constants';

export const CookiePolicySection = () => {
  const { COOKIEPOLICY_PAGE } = APPCONTENT;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <SectionContainer className="mt-[84px]" id="cookie-policy">
      <div className="mt-[50px] ">
        <h2 className="text-[40px] mobile:text-[32px] tablet:text-[32px] font-bold leading-60 text-black">
          {COOKIEPOLICY_PAGE.title}
        </h2>
        <span className="text-[16px] text-gray-900">{COOKIEPOLICY_PAGE.last_updated}</span>
      </div>

      <div className="flex mobile:flex-col-reverse gap-[25px] mt-[50px] items-start">
        <div>
          <h3 className="text-[32px] mobile:text-[24px] tablet:text-[28px] header-gradient-text font-bold  ">
            Introduction
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px] text-gray-900">
            Welcome to Unreal AI. This Cookie Policy explains how we, at Unreal AI, use cookies and
            similar technologies to recognize you when you visit our website at{' '}
            <Link
              to="https://www.unrealai.co"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.unrealai.co
            </Link>
            . It explains what these technologies are and why we use them, as well as your rights to
            control our use of them.
          </p>
        </div>
        {/* <img src={ServiceOneImage} alt="" className="w-[309px] h-[253px]" /> */}
      </div>

      <div className="text-gray-900 mt-[50px] flex flex-col gap-[30px] mb-[300px] mobile:mb-[150px] tablet:mb-[150px]">
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px]  mobile:text-[16px] font-bold">
            {COOKIEPOLICY_PAGE.what_are_cookies}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            Cookies are small data files that are placed on your computer or mobile device when you
            visit a website. Cookies are widely used by website owners in order to make their
            websites work, or to work more efficiently, as well as to provide reporting information.
            <br />
            <br />
            Cookies set by the website owner (in this case, Unreal AI) are called "first-party
            cookies." Cookies set by parties other than the website owner are called "third-party
            cookies." Third-party cookies enable third-party features or functionality to be
            provided on or through the website (e.g., advertising, interactive content, and
            analytics). The parties that set these third-party cookies can recognize your computer
            both when it visits the website in question and also when it visits certain other
            websites.
          </p>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {COOKIEPOLICY_PAGE.why_use_cookies}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {COOKIEPOLICY_PAGE.why_use_cookies_answer}
            <br />
            <br />
            The specific types of first and third-party cookies served through our website and the
            purposes they perform are described below:
          </p>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <ul className="list-decimal ml-[14px]">
            {COOKIEPOLICY_PAGE.types_of_cookies_points.map((point, index) => (
              <li key={index} className="text-[18px] mobile:text-[14px]">
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {COOKIEPOLICY_PAGE.control_of_cookies}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {COOKIEPOLICY_PAGE.control_of_cookies_answer}
            <br />
            <br />
            {`The Cookie Consent Manager can be found in the notification banner and on our website. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.`}
          </p>
        </div>

        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {COOKIEPOLICY_PAGE.what_are_cookies}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {COOKIEPOLICY_PAGE.what_are_cookies_answer}
          </p>
        </div>

        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {COOKIEPOLICY_PAGE.changes_to_cookie_policy}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {COOKIEPOLICY_PAGE.changes_to_cookie_policy_answer}
          </p>
        </div>
        <div className="flex flex-col gap-[20px] mobile:gap-[12px]">
          <h3 className="text-[20px] tablet:text-[18px] mobile:text-[16px] font-bold">
            {COOKIEPOLICY_PAGE.contact_information}
          </h3>
          <p className="text-[18px] mobile:text-[14px] tablet:text-[16px]">
            {COOKIEPOLICY_PAGE.contact_information_answer}
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};
