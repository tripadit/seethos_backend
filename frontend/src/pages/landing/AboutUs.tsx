import { useEffect } from 'react';

import AboutUsSection from '@/components/section/AboutUsSection';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <>
      <AboutUsSection />
    </>
  );
};

export default AboutUs;
