import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { isDarkVersion } from './navBarUtils';
import { SubNavItem } from './SubNavItem';

export interface ISubMenuItem {
  title: string;
  link?: string;
  path?: string;
}
export interface INavItem {
  title: string;
  onClick?: () => void;
  closeMenu?: () => void;
  pathName?: string;
  to?: string;
  index?: number;
  className?: string;
  hasSubMenu?: boolean;
  subMenuItem?: ISubMenuItem[];
}
export const NavItem: React.FC<INavItem> = (props: INavItem) => {
  const location = useLocation();
  const {
    pathName,
    className,
    title,
    closeMenu,
    onClick,
    hasSubMenu,
    subMenuItem,
    index = 1,
  } = props;
  const isHome = isDarkVersion();
  return (
    <li
      className={clsx(
        'cursor-pointer text-base font-semibold text-black ',
        {
          'text-white': isHome,
        },
        className,
      )}
      data-aos="fade-left"
      data-aos-offset={'0'}
      data-aos-delay={50 * index}
    >
      {pathName ? (
        <Link
          to={pathName}
          onClick={closeMenu}
          className={cn('hover:text-purple-600', {
            'text-purple-600': location.pathname.includes(pathName),
          })}
        >
          {title}
        </Link>
      ) : !hasSubMenu ? (
        <div onClick={() => onClick?.()} className="hover:text-purple-600">
          {title}
        </div>
      ) : (
        <SubNavItem title={title} subItems={subMenuItem} closeMenu={closeMenu} />
      )}
    </li>
  );
};
