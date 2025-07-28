import { ASSISTANCEASSIST } from '@/assets/assistance';

import { IAssistanceAvatarList } from '../types/addAssistance';

export const ASSISTANCEAVATAR: IAssistanceAvatarList[] = [
  {
    id: '4',
    avatar: ASSISTANCEASSIST.AssistanceAvatar1,
  },
  {
    id: '5',
    avatar: ASSISTANCEASSIST.AssistanceAvatar2,
  },
  {
    id: '6',
    avatar: ASSISTANCEASSIST.AssistanceAvatar3,
  },
  {
    id: '7',
    avatar: ASSISTANCEASSIST.AssistanceAvatar4,
  },
];

export const ASSISTANCENAME = [
  'Amy Smith',
  'Michelle Stark',
  'Michael Roberts',
  'Michael Roberts',
  'Amanda Keen',
  'R2D2 Brooks',
  'WALL-E Clarke',
  'Optimus Bennett',
  'C3PO Mitchell',
  'HAL Reynolds',
  'T-800 Patterson',
  'Bumblebee Morgan',
  'Sonny Davidson',
  'Johnny 5 Hayes',
  'Marvin Carter',
  'Data Foster',
  'Bender Jennings',
  'Gort Sullivan',
  'Robocop Nelson',
  'Baymax Coleman',
  'Ultron Phillips',
  'Ava Richardson',
  'Rosie Anderson',
  'TARS Bailey',
  'ED-209 Turner',
];

export const OneClickOption = [
  'Just Browsing',
  'Recommendations',
  'Promotions',
  'Customer Service',
  'Sales',
  'About Us',
  'Pricing',
  'Contact Us',
];

export const THEMEOPTION = ['dark', 'light'];

export const ASSISTANCE_ROLE = [
  {
    label: 'Customer Service Assistant',
    value: 'CUSTOMER_SERVICE_ASSISTANT',
    description:
      'Handles customer inquiries and ensures a positive experience with prompt and courteous assistance.',
    tone: 'Professional and empathetic.',
  },
  {
    label: 'Professional Assistant',
    value: 'PROFESSIONAL_ASSISTANT',
    description: 'Ensures smooth operations for professionals with efficiency and discretion.',
    tone: 'Professional and reliable',
  },
  {
    label: 'Sales Assistant',
    value: 'SALES_ASSISTANT',
    description: 'Aids sales team, ensuring effective merchandise presentation to boost sales.',
    tone: 'Energetic and enthusiastic.',
  },
  {
    label: 'Marketing Assistant',
    value: 'MARKETING_ASSISTANT',
    description:
      'Assists marketing team with various tasks to enhance brand visibility and engagement.',
    tone: 'Creative and collaborative.',
  },
  {
    label: 'Showroom Assistant',
    value: 'SHOWROOM_ASSISTANT',
    description:
      'Maintains showroom organization and assists customers with a friendly and helpful demeanor.',
    tone: 'Warm and helpful.',
  },
];

export const SupportTraningfileTypes = {
  word: [
    'application/vnd.ms-word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/docx',
    'application/msword',
  ],
  excel: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  pdf: ['application/pdf'],
};

export enum TrainingState {
  'UNTRAINED',
  'TRAINING',
  'TRAINED',
}

export enum ChatbotStep {
  'CREATING',
  'TRAINING',
  'DEPLOYING',
  'COMPLETED',
}
