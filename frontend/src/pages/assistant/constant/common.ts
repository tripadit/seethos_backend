import { ISteps } from '@/components/forms/AddBotForm/helpers';

export const STEPS: ISteps[] = [
  {
    index: 1,
    title: 'Company Details',
  },
  {
    index: 2,
    title: 'Training',
  },
  {
    index: 3,
    title: 'Data Collection',
  },
  // {
  //   index: 4,
  //   title: 'Call To Action',
  // },
];

export enum CreateBotFormStep {
  'Company Details',
  'Training',
  'Data Collection',
  'Call To Action',
}
