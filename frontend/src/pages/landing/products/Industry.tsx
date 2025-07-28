import { useEffect } from 'react';

import IndustrySection from '@/components/template/Products/industry';

const Industry = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <>
      <IndustrySection />
    </>
  );
};

export default Industry;
