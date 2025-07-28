export enum SubscriptionType {
  LOW = 'LOW',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  CUSTOM = 'CUSTOM',
}

export interface IPaymentProps {
  title: string;
  description: string;
  features: string[];
  idealFor: string;
  selectedPlan: boolean;
}

export const pricingData: IPaymentProps[] = [
  // {
  //   title: 'Agent Assist Tier',
  //   description: 'Get personalized assistance from our Professional Assistants',
  //   features: ['Up to 3 custom-trained Professional Assistants'],
  //   idealFor: 'Ideal for: Small businesses and startups seeking personalized AI solutions.',
  //   selectedPlan: true,
  // },
  {
    title: 'Growth Accelerator Tier',
    description: 'Turbocharge your growth with our marketing automation package',
    features: [
      'Up to 3 Assistants',
      'Email marketing campaigns',
      'Automated lead generation (adaptive based on ICP)',
      'Personalized and hyper-targeted email content',
      '5,000+ estimated monthly new leads',
      '25,000 estimated emails sent',
      'Custom content creation',
      'Human account manager and marketing/sales expert',
    ],
    idealFor:
      'Ideal for: Businesses looking to streamline their marketing efforts and generate quality leads.',
    selectedPlan: false,
  },
  {
    title: 'Outreach Amplifier Tier',
    description: 'Amplify your outreach efforts and expand your customer base.',
    features: [
      'Up to 5 Assistants',
      'Email marketing campaigns',
      'Automated lead generation (adaptive based on ICP)',
      'Personalized and hyper-targeted email content',
      'Google Campaigns',
      '10,000+ estimated monthly new leads',
      '45,000 estimated emails sent',
      'Custom content creation',
      'Human account manager and marketing/sales expert',
    ],
    idealFor: 'Ideal for: Growing businesses with expanding customer bases.',
    selectedPlan: false,
  },
  {
    title: 'Marketing Dynamo Tier',
    description: 'Amplify your outreach efforts and expand your customer base.',
    features: [
      'Up to 10 Assistants',
      'Email marketing campaigns',
      'Automated lead generation (adaptive based on ICP)',
      'Personalized and hyper-targeted email content',
      'Google & Meta Campaigns',
      '15,000+ estimated monthly new leads',
      '90,000 estimated emails sent',
      'Custom content creation',
      'Human account manager and marketing/sales expert',
    ],
    idealFor: 'Ideal for: Established enterprises with extensive marketing requirements.',
    selectedPlan: false,
  },
];
