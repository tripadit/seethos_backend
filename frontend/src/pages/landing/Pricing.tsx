import { useEffect } from 'react';

import { PricingSection } from '@/components/section';

const Pricing = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <>
      <PricingSection />
    </>
  );
};

export default Pricing;
