export interface ISteps {
  index: number;
  title: keyof typeof CreateBotFormStep;
}

export enum CreateBotFormStep {
  'Company Details',
  'Training',
  'Data Collection',
  'Call To Action',
}

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
  {
    index: 4,
    title: 'Call To Action',
  },
];

export const hasValue = (value: string): boolean => {
  if (value) {
    if (value !== undefined || value !== null || value !== '') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const formFields: Record<CreateBotFormStep, string[]> = {
  [CreateBotFormStep['Company Details']]: [
    'company_name',
    'company_logo',
    'avatar',
    'name',
    'status',
  ],
  [CreateBotFormStep['Training']]: [
    'greeting_message',
    'greeting_questions',
    'training_url',
    'files',
  ],
  [CreateBotFormStep['Data Collection']]: ['questions'],
  [CreateBotFormStep['Call To Action']]: ['call_to_action_link', 'agent_role'],
};

export function getStepFromParam(param: string): string {
  for (const [step, fields] of Object.entries(formFields)) {
    if (fields.includes(param)) {
      return step;
    }
  }
  return '0';
}

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
