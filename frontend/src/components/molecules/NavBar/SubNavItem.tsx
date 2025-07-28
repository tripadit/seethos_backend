import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { isDarkVersion } from './navBarUtils';

export interface ISubMenuItem {
  title: string;
  link?: string;
  path?: string;
}

interface ISubNavItem {
  title: string;
  subItems?: ISubMenuItem[];
  closeMenu?: () => void;
}

export const SubNavItem = ({ title, subItems, closeMenu }: ISubNavItem) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const subNavItemRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleBlur = (event: FocusEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleBlur);
    return () => {
      window.removeEventListener('click', handleBlur);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (!subNavItemRef.current) return;

    const containerRect = subNavItemRef.current.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Check if the cursor is within the container bounds
    if (
      mouseX >= containerRect.left &&
      mouseX <= containerRect.right &&
      mouseY >= containerRect.top &&
      mouseY <= containerRect.bottom
    ) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  const isHome = isDarkVersion();
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      onMouseLeave={handleMouseMove}
      onMouseEnter={() => setIsOpen(true)}
      className="relative  transition-all  ease-in-out delay-500"
      ref={containerRef}
    >
      <div
        className={cn(
          'flex items-center gap-[8px] py-1 justify-end lg:justify-start hover:text-purple-600',
          { 'text-purple-600': isOpen },
        )}
      >
        <p className="">{title}</p>{' '}
        <ChevronDownIcon className={clsx('w-[18px] h-[18px]', { 'rotate-180': isOpen })} />
      </div>

      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          className={clsx(
            'subnav-scale lg:absolute flex flex-col lg:w-[180px] rounded-xl lg:h-max top-[33px]  mobile:shadow-none shadow-2xl select-none   transition',
            {
              'lg:bg-dark-100': isHome,
              'lg:bg-white': !isHome,
            },
          )}
          ref={subNavItemRef}
        >
          {subItems &&
            !!subItems.length &&
            subItems.map((item, index) =>
              item.link ? (
                <Link
                  to={item?.link}
                  key={item?.link}
                  className={clsx('py-2.5 px-4 hover:bg-purple-600 hover:text-white')}
                >
                  <div key={index} className=" " onClick={() => closeMenu?.()}>
                    <p className="font-medium text-sm  text-end ">{item.title}</p>
                    <div className="lg:hidden block border-b-1 border-black"></div>
                  </div>
                </Link>
              ) : (
                <p
                  key={item?.path}
                  className={clsx('py-2.5 px-4 hover:bg-purple-600  hover:text-white')}
                  onClick={() => window.open(item.path, '_blank', 'noopener,noreferrer')}
                >
                  <div key={index} className=" " onClick={() => closeMenu?.()}>
                    <p className="font-medium text-sm  text-end ">{item.title}</p>
                    <div className="lg:hidden block border-b-1 border-black"></div>
                  </div>
                </p>
              ),
            )}
        </div>
      )}
    </div>
  );
};
