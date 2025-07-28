import clsx from 'clsx';
import React from 'react';

export const SectionContainer = ({
  children,
  className,
  id,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  innerClassName?: string;
}) => {
  return (
    <section
      className={clsx('w-full flex flex-row justify-center font-sans px-5', className)}
      id={id}
    >
      <div className={clsx('max-w-[1216px] small:max-w-[820px] w-full ', innerClassName)}>
        {children}
      </div>
    </section>
  );
};
