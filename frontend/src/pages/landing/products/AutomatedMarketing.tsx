import { useEffect } from 'react';

import AutomatedMarketing from '@/components/template/Products/automated-marketing';

const AutomatedMarketingPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <>
      <AutomatedMarketing />
    </>
  );
};

export default AutomatedMarketingPage;
