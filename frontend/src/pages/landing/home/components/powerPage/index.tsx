import { ChevronRight } from 'lucide-react';

import { SectionContainer } from '@/components/molecules/SectionContainer';
import { BusinessItem } from '@/components/section/home/components/businessItem';
import { HomePageForm } from '@/components/section/home/components/homePageForm';
import { OurFeatures } from '@/components/section/home/ourFeatures';
import { Button } from '@/components/ui/button';

import { DATADRIVEN, POWERPAGEAUTOMATE, POWERPAGESHOWROOMS } from '../../constant/home';
import { ProfessionalAssistantItem } from './helper';
import { PowerOragnization } from './helper/powerOranization';
import { RequestInformation } from './helper/requestInformation';

export const PowerPage = () => {
  return (
    <div className="w-full bg-dark-100  professional-assistance-bg">
      {/* <AboutUnrealAi /> */}
      <SectionContainer className="py-80.1">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col flex-1 justify-center items-center gap-2 pt-10">
            <h1
              data-aos="fade-up"
              data-aos-delay={'200'}
              data-aos-offset={'0'}
              className="font-bold font-roboto text-white sm:leading-[67px] text-3xl sm:text-[56px] text-center tracking-[-1px]"
            >
              UNREAL AI Powered Page<sup>TM</sup>
              <span className="lg:inline hidden">
                <br />
              </span>
              <span className="pl-2">
                Turns Sites into <span className="text-purple-600">Showrooms</span>
              </span>
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={'300'}
              data-aos-offset={'0'}
              className="text-base sm:text-2xl text-center font-normal sm:leading-[33.6px] text-white/80 mb-2"
            >
              Hire an AI assistant to greet visitors, instantly help customers,
              <span className="lg:inline hidden">
                <br />
              </span>
              and nurture sales 24/7.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {POWERPAGESHOWROOMS.map((item, index) => (
              <ProfessionalAssistantItem
                {...item}
                key={item.title}
                index={index}
                className="min-h-[386px]"
              />
            ))}
            <div className="flex flex-col justify-center items-center">
              <BusinessItem btnText="Try Powered Page" />
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center items-center  pt-32 gap-2">
            <h1
              data-aos="fade-up"
              data-aos-delay={'200'}
              data-aos-offset={'0'}
              className="font-bold font-roboto text-white sm:leading-[67px] text-3xl sm:text-[56px] text-center tracking-[-1px]"
            >
              UNREAL AI Powered Brand<sup>TM</sup>
              <span className="lg:inline hidden">
                <br />
              </span>
              <span className="pl-2">
                <span className="text-purple-600 pr-2">Automates</span>
                Your Outreach
              </span>
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={'300'}
              data-aos-offset={'0'}
              className="text-base sm:text-2xl text-center font-normal sm:leading-[33.6px] text-white/80 mb-2"
            >
              <span className="font-bold">Our Done For You </span> services offer founders and small
              teams
              <span className="lg:inline hidden">
                <br />
              </span>
              a powerful business development engine.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {POWERPAGEAUTOMATE.map((item, index) => (
              <ProfessionalAssistantItem
                {...item}
                key={item.title}
                index={index}
                className="min-h-[585px]"
                imageClassName="min-h-[395px]"
              />
            ))}
            <RequestInformation />
          </div>
          <div className="w-full flex flex-col pt-32 gap-8">
            <div className="flex flex-row items-center justify-center text-center">
              <div className="max-w-[650px] w-full text-center ">
                <h1
                  data-aos="fade-up"
                  data-aos-delay={'200'}
                  data-aos-offset={'0'}
                  className="font-bold font-roboto text-white sm:leading-[67px] text-3xl sm:text-[56px] text-left tracking-[-1px]"
                >
                  Become an UNREAL AI Powered Organization<sup>TM</sup>
                </h1>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center w-full">
              <PowerOragnization />
            </div>
            <HomePageForm buttonText="Request A Meeting" />
          </div>
          <div className="flex flex-col flex-1 justify-center items-center  pt-32">
            <h1
              data-aos="fade-up"
              data-aos-delay={'200'}
              data-aos-offset={'0'}
              className="font-bold font-roboto text-white sm:leading-[67px] text-3xl sm:text-[56px] text-center tracking-[-1px]"
            >
              Data Driven
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={'300'}
              data-aos-offset={'0'}
              className="text-base sm:text-2xl text-center font-normal sm:leading-[33.6px] text-white/80 mb-2"
            >
              Driven by data, powered by AI, controlled by you
            </p>
          </div>
          <div className="flex flex-row gap-8 flex-wrap justify-center">
            {DATADRIVEN.map((item, index) => (
              <ProfessionalAssistantItem
                {...item}
                key={item.title}
                index={index}
                className="min-h-[640px] max-w-[488px] w-full"
                imageClassName="min-h-[350px] object-contain"
              />
            ))}
          </div>
          <Button
            variant={'default'}
            className="text-purple-500 text-2xl flex flex-row items-center justify-center"
          >
            <span> Create your AI chatbot now</span>
            <ChevronRight className="text-purple-500 mt-1" size={24} />
          </Button>
        </div>
      </SectionContainer>
      <OurFeatures />
    </div>
  );
};
