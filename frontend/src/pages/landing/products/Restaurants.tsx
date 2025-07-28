import { useEffect } from 'react';

import Products from '@/components/template/Products';

const Restaurants = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <>
      <Products />
    </>
  );
};

export default Restaurants;
