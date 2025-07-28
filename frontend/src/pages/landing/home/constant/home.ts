import { HOMEASSETS } from '@/assets/home';
import { ABOUTUNREALAIIMAGE } from '@/assets/home/aboutUnrealAi';
import { POWERPAGE } from '@/assets/home/powerpage';

import { IAboutUnrealAi, IProfessionalAssistantItem } from '../types/home';

export const ABOUTUNREALAI: IAboutUnrealAi[] = [
  {
    image: ABOUTUNREALAIIMAGE.SlideImage,
    title: 'AI is complicated and can be scary,',
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage2,
    title: `But like fire, electricity, internet, smartphones,... Artificial Intelligence is here
    `,
    titleClassName: 'max-w-[800px] w-full',
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage3,
    title: `Businesses are using AI in`,
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage4,
    title: `Businesses are using AI To`,
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage8,
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage6,
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage7,
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage9,
    title: 'We are certified AI professionals',
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage10,
  },
  {
    image: ABOUTUNREALAIIMAGE.SlideImage12,
    title: `Follow a proven process to become
    an AI Powered Organization`,
    titleClassName: 'max-w-[580px] w-full',
  },
  {
    title: 'Meet your AI Advisor',
    image: ABOUTUNREALAIIMAGE.SlideImage11,
  },
];

export const POWERPAGESHOWROOMS: IProfessionalAssistantItem[] = [
  {
    image: POWERPAGE.ProfesionalAvatar,
    title: 'Professional Avatar',
  },
  {
    image: POWERPAGE.Chat,
    title: 'Messaging Experience',
  },
  {
    image: POWERPAGE.EasyOnboarding,
    title: 'Easy Onboarding',
  },
];

export const POWERPAGEAUTOMATE: IProfessionalAssistantItem[] = [
  {
    image: POWERPAGE.IncreaseBrandEquity,
    title: `Increase brand equity in your 
    target markets`,
  },
  {
    image: POWERPAGE.GenerateLeads,
    title: `Generate leads that match your Ideal Client Profile`,
  },
  {
    image: POWERPAGE.VirtualRobort,
    title: `Free time for the most important things only you can do`,
  },
];

export const POWERPAGEORGANIZATION: IAboutUnrealAi[] = [
  {
    image: POWERPAGE.PowerOranization,
    title: 'We customize our approach',
  },
  {
    image: POWERPAGE.PowerOrganization2,
    title: `Then we create an UNREAL AI Game Plan™ 
    to target a 3x Return on Investment`,
  },
  {
    image: POWERPAGE.PowerOrganization3,
    title: 'Become a client and share opportunities',
  },
];
export const DATADRIVEN: IProfessionalAssistantItem[] = [
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
    image: HOMEASSETS.DataDriven3,
    className: 'lg:max-w-[488px] w-full',
    title: `Automated data 
      collection from leads`,
    description: `Can be trained by multiple sources like website, help centeror text documents and updated later on.`,
  },
  {
    image: HOMEASSETS.DataDriven2,
    className: 'lg:max-w-[488px] w-full',
    title: `Manage Your links/files 
      that train assistants`,
    description: `All data is processed and hosted only
      in the ChatBot platform.`,
  },
];
