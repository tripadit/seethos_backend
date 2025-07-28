import React from 'react';

import { Switch } from '@/components/ui/switch';

const Payment = () => {
  const [isMonthly, setIsMonthly] = React.useState(true);
  return (
    <div className="m-2 sm:m-10 flex flex-col items-center justify-center sm:items-start sm:justify-start 2xl:my-20 2xl:mx-32 ">
      <div className="flex flex-col items-center justify-center sm:items-start sm:justify-start">
        <p className="text-4xl sm:text-sm text-purple-500 font-semibold md:mb-4 mb-2">Pricing</p>
        <h1 className="text-2xl md:text-5xl text-center sm:text-start text-gray-900 font-semibold md:leading-62">
          Simple, transparent pricing
        </h1>
        <p className="text-sm md:text-xl text-center sm:text-start mt-4 text-gray-500">
          We believe autonomous agent feature should be accessible to all companies, no matter the
          size.
        </p>
        <div className="flex flex-row gap-2 text-xl text-gray-500 font-medium mt-4 items-center">
          <p>Bill Yearly</p>{' '}
          <Switch checked={isMonthly} onCheckedChange={() => setIsMonthly(!isMonthly)} />{' '}
          <p>Bill Monthly</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
