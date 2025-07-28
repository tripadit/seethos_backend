import loadable from '@loadable/component';
const Lottie = loadable(() => import('react-lottie'));
export interface IFeatureImageCard {
  animation: any;
  [key: string]: any;
}

export const FeatureImageCard = ({ animation, ...props }: IFeatureImageCard) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
  };
  return (
    <div className="bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5 border border-white/20 shadow-professionalAssistance rounded-lg max-w-[644px] w-full h-[300px] sm:h-[518px]">
      <Lottie options={defaultOptions} {...props} />
    </div>
  );
};
