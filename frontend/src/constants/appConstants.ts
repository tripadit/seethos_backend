import { ANIMATION } from '@/assets/animation';

export interface IFeatureItems {
  heading: string;
  decription: string;
  animation: any;
  imageClassName: string;
  isReverse?: boolean;
  height?: number;
  width?: number;
  style?: any;
  buttonText?: string;
  onReadMore?: () => void;
  node?: React.ReactNode;
}

export const featureItems: IFeatureItems[] = [
  {
    heading: 'Autonomous Professional Assistants',
    decription: `Adopting Autonomous Professional Assistants, like those offered by Unreal AI, is essential for businesses aiming to enhance efficiency, reduce costs, and provide round-the-clock service. Unreal AI's technology automates routine tasks, delivers personalized customer experiences, and generates insights for smarter decisions, helping businesses stay competitive and agile in a rapidly evolving market. With Unreal AI, companies can achieve seamless operations and sustainable growth effortlessly.`,
    animation: ANIMATION.AutomationAi,
    imageClassName: 'bottom-[7px] -left-1',
    height: 700,
    width: 650,
    style: {
      position: 'relative',
      left: '-46px',
    },
    buttonText: 'Implement Professional Assistants Today',
    // onReadMore: () => {},
  },
  {
    heading: 'Cost-Effective Solutions',
    decription: `Unreal AI offers businesses a pathway to reduce costs and boost revenue through automation and intelligent insights. By streamlining operations and minimizing the need for manual intervention, companies can lower operational expenses while enhancing efficiency. Furthermore, Unreal AI's data-driven recommendations help identify new revenue opportunities, optimizing strategies for growth. This dual approach ensures businesses can achieve more with less, making Unreal AI an essential tool for cost-effective business management.`,
    animation: ANIMATION.CostEffective,
    imageClassName: 'bottom-[10px] right-0 w-[170px]',
    isReverse: true,
    height: 800,
    width: 650,
    buttonText: 'Cut Costs, Boost Revenue now',
    // onReadMore: () => {},
  },
  {
    heading: 'Dynamic Email Marketing',
    decription: `Unreal professional assistants revolutionize email marketing by ensuring every lead receives a personalized message, significantly enhancing engagement and conversion rates. By analyzing individual preferences and behaviors, these Professional Assistants craft tailored communications that resonate on a personal level. Moreover, their capability to perform efficient A/B testing allows for real-time adjustments to campaigns, seamlessly shifting strategies towards the most effective approaches. This dynamic adaptation not only optimizes email marketing efforts but also ensures businesses stay ahead of the curve, maximizing the impact of their campaigns with minimal manual effort. Unreal Professional Assistants thus represent a powerful tool for creating highly targeted, adaptive, and successful email marketing strategies.`,
    animation: ANIMATION.EmailMarketing,
    imageClassName: 'bottom-[10px] right-0 w-[170px]',
    height: 800,
    buttonText: 'Make Email Campaigns Effective',
    // onReadMore: () => {},
  },
  {
    heading: 'Adaptive Lead Generation',
    decription: `Unreal AI professional assistants harness advanced learning algorithms to deeply understand a business's Ideal Customer Profile (ICP), identifying key characteristics and preferences of the target market. Armed with this knowledge, they initiate sophisticated crawlers across the internet, scanning through websites, social media platforms, and professional networks to identify and generate leads that precisely match the defined ICP. This streamlined process not only ensures a high-quality lead pool tailored to the business's specific needs but also significantly reduces the time and resources traditionally required for lead generation. By leveraging Unreal AI's capabilities, businesses can focus on engaging highly relevant prospects, thereby improving conversion rates and driving growth more effectively.`,
    animation: ANIMATION.CustomLeadScraping,
    imageClassName: 'bottom-[7px] -left-1',
    isReverse: true,
    height: 700,
    width: 650,
    style: {
      position: 'relative',
      left: '-46px',
    },
    buttonText: 'Generate Custom Lead List',
    // onReadMore: () => {},
  },
  {
    heading: '24/7 Autonomous Operation',
    decription: `Your marketing never sleeps with Unreal AI. Our professional assistants work around the clock, ensuring your brand is always engaging, always optimizing, and always growing.`,
    animation: ANIMATION.AllTimeSupport,
    imageClassName: 'bottom-[7px] -left-1',
    height: 700,
    width: 650,
    style: {
      position: 'relative',
      left: '-46px',
    },
    buttonText: 'Begin 24/7 Marketing on Autopilot',
    // onReadMore: () => {},
  },
];
