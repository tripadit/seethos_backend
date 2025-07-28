import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { APPLOGO } from '@/assets/logo';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/global/config';
import { useSignIn } from '@/hooks/api';
import { useNavigationScroll } from '@/hooks/useScrollNavigation';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { routes } from '@/routes/routes';

import { isDarkVersion } from './navBarUtils';
import { INavItem, NavItem } from './NavItem';

export const Navbar = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [navbarColor, setNavbarColor] = useState<string>('bg-transparent');
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { handleScrollToSection } = useNavigationScroll();
  const { status: signInStatus, mutate: signInFn } = useSignIn();
  const isHome = isDarkVersion();
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollPosition > 80) {
      if (isHome) {
        setNavbarColor('bg-dark-100');
      } else {
        setNavbarColor('bg-white');
      }
    } else {
      setNavbarColor('bg-transparent');
    }
  }, [scrollPosition]);

  const NAVITEMS: INavItem[] = [
    {
      title: 'Home',
      onClick: () => handleScrollToSection({ id: 'hero' }),
      to: 'hero',
    },

    {
      title: 'Features',
      onClick: () => handleScrollToSection({ id: 'features' }),
      to: 'features',
    },
    {
      title: 'Services',
      hasSubMenu: true,
      subMenuItem: [
        {
          link: '/products/restaurants',
          title: 'Restaurants',
        },
        {
          link: '/products/autonomous-agents',
          title: 'Autonomous Agents',
        },
        {
          link: '/products/unreal-ai-marketing',
          title: 'Unreal AI Marketing',
        },
        {
          path: 'https://www.scalebuild.ai',
          title: 'Custom Software Development',
        },
        {
          link: '/products/industry-4.0',
          title: 'Industry 4.0',
        },
      ],
    },
    {
      title: 'Our Plans',
      pathName: '/our-plans',
    },
    {
      title: 'Blog',
      pathName: '/blog',
    },
    {
      title: 'Sign In',
      pathName: '/sign-in',
    },
    {
      title: `${signInStatus === 'loading' ? 'Loading...' : 'Try Demo'}`,
      onClick: () => signInFn({ email: CONFIG.DEMO_USERID, password: CONFIG.DEMO_PASSWORD }),
    },
  ];

  const clickHandler = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div
      className={clsx(
        'fixed top-0 z-50   w-full h-[80px] px-5 py-5 flex flex-row justify-center',
        {
          'bg-transparent': isHome && navbarColor === 'bg-transparent',
        },
        navbarColor,
      )}
    >
      <div className="max-w-[1200px] w-full flex flex-row justify-between gap-5 items-center">
        <div
          className="flex flex-row gap-2 items-center cursor-pointer"
          data-aos="fade-right"
          data-aos-delay={'100'}
          data-aos-offset={'0'}
          onClick={() => navigate(routes.home)}
        >
          <img
            src={isHome ? APPLOGO.AppWhiteLogo : APPLOGO.AppBlackLogo}
            alt="logo"
            className="w-[140px] object-contain"
          />
        </div>
        <ul className="flex flex-row gap-10 items-center justify-end flex-1 small:hidden">
          {NAVITEMS.map((item, index) => (
            <NavItem index={index + 1} key={index} {...item} />
          ))}
          <div
            data-aos="fade-left"
            data-aos-delay={'100'}
            data-aos-offset={'0'}
            onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            className={clsx(
              'font-semibold border-2 px-6 py-2 rounded-lg select-none  cursor-pointer  hover:text-purple-500 hover:border-purple-500',
              {
                'text-white border-white': isHome,
                'text-black border-black': !isHome,
              },
            )}
          >
            Get Started
          </div>
        </ul>
        <div
          className={`laptop:hidden desktop:hidden block ${showMenu ? 'close ' : ''}`}
          onClick={clickHandler}
        >
          <div
            className={clsx('btn-line 1 bg-black', {
              'bg-white': isHome,
            })}
          ></div>
          <div
            className={clsx('btn-line 2 bg-black', {
              'bg-white': isHome,
            })}
          ></div>
          <div
            className={clsx('btn-line 3 bg-black', {
              'bg-white': isHome,
            })}
          ></div>
        </div>
        {showMenu && <MobileMenu NAVITEMS={NAVITEMS} closeMenu={clickHandler} />}
      </div>
    </div>
  );
};

const MobileMenu = ({ NAVITEMS, closeMenu }: { NAVITEMS: INavItem[]; closeMenu: () => void }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div
      onClick={(e) => {
        e.stopPropagation(), closeMenu();
      }}
      className="h-screen w-screen fixed top-0 left-0 bg-white/50 z-40"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={clsx(
          'max-w-[270px] border-l w-full fixed  right-0 top-0 h-screen shadow-lg flex flex-col',
          {
            'bg-white': !isHome,
            'bg-dark-100': isHome,
          },
        )}
      >
        <div className="relative h-screen w-full">
          <div className="absolute -left-4 top-5 ">
            <div
              onClick={closeMenu}
              className="w-8 h-8 text-white background-purple-primary flex flex-col justify-center items-center rounded-full"
            >
              <X />
            </div>
          </div>
          <div className="overflow-hidden landing-navbar">
            <ul className="flex overflow-hidden flex-col gap-5 items-end  px-5 py-10 overflow-y-auto justify-end flex-1">
              {NAVITEMS.map((item, index) => (
                <NavItem
                  index={index + 1}
                  key={index}
                  {...item}
                  className="text-black"
                  closeMenu={closeMenu}
                />
              ))}
              <Button
                variant={'gradient'}
                data-aos="fade-left"
                data-aos-delay={'100'}
                data-aos-offset={'0'}
                onClick={() => window.open('https://calendly.com/ujjwalroy/30min', '_blank')}
              >
                Book demo
              </Button>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
