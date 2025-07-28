import clsx from 'clsx';

export const SectionHeading = ({
  heading,
  subHeading,
  className,
  subHeadingClassName = 'text-neutral-900',
  headingClassName = 'text-center',
}: {
  heading: string;
  subHeading?: string;
  className?: string;
  subHeadingClassName?: string;
  headingClassName?: string;
}) => {
  return (
    <div className={clsx('w-full', className)}>
      <h1
        data-aos="zoom-in"
        data-aos-offset={'0'}
        data-aos-delay={'100'}
        className={clsx(
          'font-bold text-48  small:text-[38px] capitalize text-neutral-900 ',
          headingClassName,
        )}
      >
        {heading}
      </h1>
      {subHeading && (
        <p
          className={clsx('text-lg small:text-base font-normal  text-center', subHeadingClassName)}
          data-aos="zoom-in"
          data-aos-offset={'0'}
          data-aos-delay={'200'}
        >
          {subHeading}
        </p>
      )}
    </div>
  );
};
