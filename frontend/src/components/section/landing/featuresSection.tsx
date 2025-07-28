import loadable from '@loadable/component';
import clsx from 'clsx';
import { useMixpanel } from 'react-mixpanel-browser';

import { HeadingLine } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';
import { IFeatureItems } from '@/constants/appConstants';
import { cn, LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV1 } from '@/mixpanel/appMixpanel';

const Lottie = loadable(() => import('react-lottie'));

interface IFeatureSectionProps {
  features: IFeatureItems[];
  title?: string;
  className?: string;
}

export const FeaturesSection = ({ features, title, className }: IFeatureSectionProps) => {
  return (
    <div className={cn('features-container', className)}>
      <SectionContainer id="features" className="mobile:py-10 py-[102px] ">
        {title && (
          <h3 className="small:text-32 text-[56px] font-bold mb-10 text-center">{title}</h3>
        )}
        <div className="flex flex-col mobile:gap-20 gap-120 flex-1">
          {features.map((el) => (
            <FeatureItems {...el} key={el.heading} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export const FeatureItems = ({ isReverse = false, ...props }: IFeatureItems) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 mobile:flex  mobile:flex-col  w-full items-center features-items mobile:gap-7 gap-[109px]',
        {},
      )}
    >
      {!isReverse ? (
        <>
          <div className="sm:hidden">
            <FeatureImage {...props} style={{}} height={300} width={300} />
          </div>
          <FeatureDetails {...props} isReverse={isReverse} />
          <div className="mobile:hidden">
            <FeatureImage {...props} />
          </div>
        </>
      ) : (
        <>
          <div className="mobile:hidden">
            <FeatureImage {...props} />
          </div>
          <div className="sm:hidden">
            <FeatureImage
              data-aos={'fade-left'}
              data-aos-delay={400}
              {...props}
              height={300}
              width={300}
            />
          </div>{' '}
          <FeatureDetails {...props} isReverse={isReverse} />
        </>
      )}
    </div>
  );
};

const FeatureDetails = ({
  decription,
  heading,
  imageClassName,
  buttonText,
  onReadMore,
  node,
}: IFeatureItems) => {
  const mixpanel = useMixpanel();
  return (
    <div className="flex flex-col mobile:gap-2  gap-4">
      <div data-aos={'fade-right'} data-aos-delay={400} className="relative w-fit">
        <h1 className="text-neutral-900 font-bold small:text-32 text-40 tracking-tighter relative z-10">
          {heading}
        </h1>
        <img src={HeadingLine} className={clsx('mobile:hidden absolute z-[5] ', imageClassName)} />
      </div>
      <p
        data-aos={'fade-up'}
        data-aos-delay={200}
        className="mobile:text-sm text-lg font-normal text-neutral-700"
      >
        {decription}{' '}
        {onReadMore && (
          <span onClick={onReadMore} className="text-primary-400 cursor-pointer">
            read me.
          </span>
        )}
      </p>
      {node && node}
      {buttonText && (
        <Button
          data-aos={'fade-up'}
          data-aos-delay={300}
          variant={'unrealPrimary'}
          className="w-fit"
          onClick={() => {
            APPMIXPANELV1.featureSection.onClick(mixpanel);
            window.open(LANDING_CALENDLY_URL, '_blank');
          }}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};
export const FeatureImage = ({ animation, ...props }: IFeatureItems) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
  };
  return (
    <div
      data-aos={'fade-left'}
      data-aos-delay={600}
      className="w-full features-farme flex flex-col flex-1 justify-start "
    >
      <Lottie options={defaultOptions} {...props} />
    </div>
  );
};
