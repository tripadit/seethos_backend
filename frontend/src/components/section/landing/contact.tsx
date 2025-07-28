import { useContext } from 'react';

import { ContactUsBgImage, ContactUsRight } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';

import { AppContext } from '../ChatbotSection/chatbot/context/appConetxt';
import { Chatbot } from '../ChatbotSection/chatbot/routes';

export const ContactUs = () => {
  const chatbot = useContext(AppContext);
  return (
    <div>
      <SectionContainer className="">
        <div className="flex flex-row items-center gap-10 h-[810px]">
          <div className="contact-us-bg w-1/2 h-full relative">
            <img src={ContactUsBgImage} alt="" className="absolute bottom-0 left-0 " />
            <img src={ContactUsRight} alt="" className="absolute bottom-[119px] right-8" />
          </div>
          <div className="w-1/2 flex flex-col gap-2 h-full py-[97px]">
            <h1 className="text-40 text-neutral-900 font-bold">Contact Us</h1>
            <p className="text-neutral-700 text-xl font-normal">
              Join the future of business automation. Contact us now to learn how Unreal AI can
              transform your business today.
            </p>
            <div className="h-[600px] mt-4">{!chatbot.isLoading && <Chatbot isSmall={true} />}</div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
