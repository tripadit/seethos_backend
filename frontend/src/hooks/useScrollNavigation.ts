import { useLocation, useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';

import { isDarkVersion } from '@/components/molecules/NavBar/navBarUtils';

export const useNavigationScroll = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scollerHanlder = (id: string) => {
    scroller.scrollTo(id, {
      duration: 700,
      offset: isDarkVersion() ? -120 : 60,
      smooth: true,
    });
  };

  const handleScrollToSection = ({ id }: { id: string }) => {
    if (location.pathname !== '/' && !isDarkVersion()) {
      navigate('/');
      setTimeout(() => {
        scollerHanlder(id);
      }, 250);
    } else {
      scollerHanlder(id);
    }
  };

  return {
    handleScrollToSection,
  };
};
