import clsx from 'clsx';
import { CreditCard, Percent } from 'lucide-react';

import { HomePageForm } from './homePageForm';
interface IBusinessItem {
  title?: string;
  subTitle?: string;
  headingClassName?: string;
  className?: string;
  isHeroSection?: boolean;
  topSectionClassName?: string;
  btnText?: string;
}

//
export const BusinessItem = ({
  title,
  subTitle,
  headingClassName,
  className,
  isHeroSection = false,
  topSectionClassName,
  btnText = 'Try Out Unreal AI',
}: IBusinessItem) => {
  return (
    <div className={clsx('w-full flex flex-col gap-8', className)}>
      {title && (
        <div
          className={clsx(
            'flex flex-col flex-1  gap-3',
            {
              'justify-center items-center ': !isHeroSection,
            },
            topSectionClassName,
          )}
        >
          <h1
            data-aos="fade-up"
            data-aos-delay={'200'}
            data-aos-offset={'0'}
            className={clsx(
              'font-bold font-roboto text-white mobile:mt-3  tracking-[-1px]',
              headingClassName,
            )}
          >
            {title}
          </h1>
          {subTitle && (
            <p
              data-aos="fade-up"
              data-aos-delay={'300'}
              data-aos-offset={'0'}
              className="text-base sm:text-2xl text-left  font-normal sm:leading-[33.6px] text-[#AEAEAE] mb-2"
            >
              {subTitle}
            </p>
          )}
        </div>
      )}
      <HomePageForm isHeroSection={isHeroSection} buttonText={btnText} />
      <div className="flex flex-row flex-1 w-full gap-5 items-center justify-center">
        <div
          data-aos="fade-up"
          data-aos-delay={'550'}
          data-aos-offset={'0'}
          className="border bg-hero-section-gradient shadow-heroInput  w-full max-w-[646px] flex flex-col sm:flex-row gap-5 items-center rounded-xl p-4 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5  border-white/40
          "
        >
          <div className="flex flex-row gap-4 items-center max-w-[295px] w-full">
            <div className="p-2 bg-[#76707d] rounded-full">
              <Percent size={26} className="text-white" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-base text-white font-bold">Free 14-day trial</h1>
              <p className="text-sm font-normal text-white/80">
                Enjoy our free demo and decide for yourself.
              </p>
            </div>
          </div>
          <div className="sm:w-[1.5px] w-full h-[1px] sm:h-[60px] bg-[#E3E3E3]" />
          <div className="flex flex-row gap-4 items-center  max-w-[295px] w-full">
            <div className="p-2 bg-[#76707d] rounded-full">
              <CreditCard size={26} className="text-white" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-base text-white font-bold">No credit card required</h1>
              <p className="text-sm font-normal text-white/80">
                Easy sign up without having to fill in your credit card credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
