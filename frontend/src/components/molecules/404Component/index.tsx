import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const My404Component: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-2">404 - Not Found</h1>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
      <Button className="mt-5 capitalize" variant="outline" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  );
};
