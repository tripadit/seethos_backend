import { FacebookIcon, LinkedinIcon, Mail, MapPin, PhoneCall, TwitterIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { InstagramIcon, PinterestIcon, TiktokIcon } from '@/assets/icons';
import { APPLOGO } from '@/assets/logo';
import { useNavigationScroll } from '@/hooks/useScrollNavigation';
import { routes } from '@/routes/routes';

import { SectionContainer } from '../molecules/SectionContainer';

export const FooterSection = () => {
  const navigate = useNavigate();
  const { handleScrollToSection } = useNavigationScroll();

  const PAGES = [
    {
      title: 'About Us',
      onClick: () => {
        navigate(routes.aboutUs);
      },
    },
    {
      title: 'Contact Us',
      onClick: () => handleScrollToSection({ id: 'contact' }),
    },
  ];

  const UTILITYPAGE = [
    {
      title: 'Cookie Policy',
      path: '/cookie-policy',
    },
    {
      title: 'Privacy Policy',
      path: '/privacy-and-policy',
    },
    {
      title: 'Tems Of Service',
      path: '/terms-of-service',
    },
  ];

  return (
    <SectionContainer className="bg-[#0E1022]      py-80.1 mobile:py-10" id="footer-section">
      <div className="flex flex-col gap-10">
        <div className="flex flex-row mobile:flex-col gap-10 justify-between">
          <div className="flex flex-col gap-8">
            {/* logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (location.pathname === '/') {
                  handleScrollToSection({ id: 'hero' });
                } else {
                  navigate(routes.home);
                  handleScrollToSection({ id: 'hero' });
                }
              }}
            >
              <img src={APPLOGO.AppWhiteLogo} alt="logo" className="w-[170px] object-contain" />
            </div>

            <div className="flex gap-10 justify-between">
              {/* contact details */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <PhoneCall className="text-white" />
                    <h1 className="uppercase text-lg text-white">Contact</h1>
                  </div>
                  <p className="text-white">+1 919 576 6153</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Mail className="text-white" />
                      <h1 className="uppercase text-lg text-white">E-mail</h1>
                    </div>
                    <p className="text-white">contact@unrealai.co</p>
                  </div>
                </div>
              </div>

              {/* location */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <MapPin className="text-white" />
                  <h1 className="uppercase text-lg text-white"></h1>
                </div>
                <p className="text-white">
                  Raleigh,
                  <br />
                  North Carolina, USA
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col mobile:w-full w-1/2 gap-10">
            <div className="grid grid-cols-3 mobile:grid-cols-1 gap-10">
              <ul className="flex flex-col gap-5">
                <li className="mt-4"></li>
                {PAGES.map((el, index) => (
                  <li
                    key={el.title + index}
                    onClick={el.onClick}
                    className="text-white select-none font-medium  cursor-pointer hover:text-purple-500"
                    data-aos="fade-right"
                    data-aos-offset={'0'}
                    data-aos-delay={100 * index}
                  >
                    {el.title}
                  </li>
                ))}
              </ul>

              <ul className="flex flex-col gap-5">
                <li className="mt-4"></li>
                {UTILITYPAGE.map((el, index) => (
                  <Link to={el.path} key={el.title + index}>
                    <li
                      //   onClick={el.onClick}
                      className="text-white select-none font-medium  cursor-pointer  hover:text-purple-500"
                      data-aos="fade-right"
                      data-aos-offset={'0'}
                      data-aos-delay={100 * index}
                    >
                      {el.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="h-[1px] bg-white/50"></div>
        <div className="flex flex-row mobile:flex-col mobile:gap-5 justify-between items-center">
          <p
            className="text-white/40 text-base"
            data-aos="fade-right"
            data-aos-offset={'0'}
            data-aos-delay={'200'}
          >
            <span className=""> Copyright © {new Date().getFullYear()},</span>{' '}
            <a
              href="https://unrealai.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-purple-500"
            >
              UNREALAI, Co.
            </a>
            <span className=""> All Rights Reserved.</span>{' '}
          </p>
          <div className="flex flex-row gap-5 items-center">
            <a
              href="https://www.facebook.com/scalebuildai"
              target="_blank"
              rel="noreferrer"
              data-aos="fade-right"
              data-aos-offset={'0'}
              data-aos-delay={'200'}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
                <FacebookIcon fill="text-black" size={18} strokeOpacity={0} />
              </div>
            </a>
            <a
              href="https://twitter.com/scalebuildai"
              target="_blank"
              rel="noreferrer"
              data-aos="fade-right"
              data-aos-offset={'0'}
              data-aos-delay={'300'}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
                <TwitterIcon fill="text-black" size={18} strokeOpacity={0} />
              </div>
            </a>
            <a
              href="https://www.linkedin.com/company/scalebuildai"
              target="_blank"
              rel="noreferrer"
              data-aos="fade-right"
              data-aos-offset={'0'}
              data-aos-delay={'400'}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
                <LinkedinIcon fill="text-black" strokeOpacity={0} size={18} />
              </div>
            </a>
            <a
              href="https://www.instagram.com/scalebuildai"
              target="_blank"
              rel="noreferrer"
              data-aos="fade-right"
              data-aos-offset={'0'}
              data-aos-delay={'500'}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
                <InstagramIcon />
              </div>
            </a>
            <a
              href="https://www.pinterest.es/scalebuildai/"
              target="_blank"
              rel="noreferrer"
              data-aos="fade-right"
              data-aos-offset={'0'}
              data-aos-delay={'600'}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
                <PinterestIcon />
              </div>
            </a>
            <a
              href="https://www.tiktok.com/@scalebuildai?_t=8foXTR0OSKP&_r=1"
              target="_blank"
              rel="noreferrer"
              data-aos="fade-right"
              data-aos-offset={'0'}
              data-aos-delay={'700'}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center bg-white rounded-md cursor-pointer">
                <TiktokIcon />
              </div>
            </a>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
