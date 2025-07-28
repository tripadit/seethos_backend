import { ChevronRight } from 'lucide-react';

import { HOMEASSETS } from '@/assets/home';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';

import {
  IProfessionalAssistantItem,
  ProfessionalAssistantItem,
} from './components/professionalAssistantItem';

export const ProfessionalAssistant = () => {
  const items: IProfessionalAssistantItem[] = [
    {
      image: HOMEASSETS.StandAloneAi,
      className: 'lg:max-w-[488px] w-full',
      title: 'Stand Alone AI',
      description: 'No dependencies on third-party providers like OpenAI,Google Bard or Bing AI.',
    },
    {
      image: HOMEASSETS.RightAnswer,
      className: 'lg:max-w-[696px] w-full',
      title: 'Right answers in a flash',
      description: `Much faster than comparable solutions, replies immediately, and 
        hosts human-like conversations.`,
    },
    {
      image: HOMEASSETS.MultiDatasource,
      className: 'lg:max-w-[696px] w-full',
      title: 'Multiple data sources',
      description: `Can be trained by multiple sources like website, help center
        or text documents and updated later on.`,
    },
    {
      image: HOMEASSETS.DataSecured,
      className: 'lg:max-w-[488px] w-full',
      title: 'Data secured',
      description: `All data is processed and hosted only
        in the ChatBot platform.`,
    },
  ];

  const dataDriven: IProfessionalAssistantItem[] = [
    {
      image: HOMEASSETS.DataDriven,
      className: 'lg:max-w-[488px] w-full',
      title: `Manage all your
    assistant interactions`,
      description: `Can be trained by multiple sources like website, help centeror text documents and updated later on.`,
    },
    {
      image: HOMEASSETS.DataDriven1,
      className: 'lg:max-w-[488px] w-full',
      title: `Control what your assistant asks to reach your goal`,
      description: `All data is processed and hosted only
        in the ChatBot platform.`,
    },
    {
      image: HOMEASSETS.DataDriven1,
      className: 'lg:max-w-[488px] w-full',
      title: `Automated data 
        collection from leads`,
      description: `Can be trained by multiple sources like website, help centeror text documents and updated later on.`,
    },
    {
      image: HOMEASSETS.DataDriven1,
      className: 'lg:max-w-[488px] w-full',
      title: `Manage Your links/files 
        that train assistants`,
      description: `All data is processed and hosted only
        in the ChatBot platform.`,
    },
  ];
  return (
    <div className="w-full bg-dark-100  professional-assistance-bg">
      <SectionContainer className="py-80.1">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col flex-1 justify-center items-center gap-3">
            <h1
              data-aos="fade-up"
              data-aos-delay={'200'}
              data-aos-offset={'0'}
              className="font-bold text-white sm:leading-[67px] text-3xl sm:text-[56px] text-center tracking-[-1px]"
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
              className="text-base sm:text-2xl text-center font-normal sm:leading-[33.6px] text-[#8A9BB7] mb-2"
            >
              Hire an AI assistant to greet visitors, instantly help customers,
              <span className="lg:inline hidden">
                <br />
              </span>
              and nurture sales 24/7.
            </p>
          </div>
          <div className="flex flex-row gap-8 flex-wrap">
            {items.map((item, index) => (
              <ProfessionalAssistantItem {...item} key={item.title} index={index} />
            ))}
          </div>
          <div className="flex flex-col flex-1 justify-center items-center gap-3 mt-10">
            <h1
              data-aos="fade-up"
              data-aos-delay={'500'}
              data-aos-offset={'0'}
              className="font-bold text-white mobile:mt-3 md:leading-[45px] xl:leading-[67px] mobile:text-3xl text-[56px] text-center tracking-[-1px]"
            >
              Data Driven
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={'550'}
              data-aos-offset={'0'}
              className="text-base sm:text-2xl text-center font-normal sm:leading-[33.6px] text-[#8A9BB7] mb-2"
            >
              Driven by data, powered by AI, controlled by you
            </p>
          </div>
          <div className="flex flex-row gap-8 flex-wrap justify-center">
            {dataDriven.map((item, index) => (
              <ProfessionalAssistantItem index={index} {...item} key={item.title} />
            ))}
          </div>
          <Button className="primary-gradient-text" variant={'default'} size={'lg'}>
            Create your AI chatbot now <ChevronRight className="text-[#DC3450]" size={20} />
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
};
