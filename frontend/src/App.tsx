import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AOS from 'aos';
import { useEffect } from 'react';
import { MixpanelProvider } from 'react-mixpanel-browser';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { router } from '@/routes';
import queryClient from '@/utils/queryClient';

import { CONFIG } from './global/config';

const MIXPANEL_TOKEN = CONFIG.MIXPANEL_TOKEN;

const MIXPANEL_CONFIG = {
  track_pageview: true, // Set to `false` by default
};

function App() {
  useEffect(() => {
    AOS.init({});
  }, []);
  return (
    <>
      <MixpanelProvider config={MIXPANEL_CONFIG} token={MIXPANEL_TOKEN}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </QueryClientProvider>
      </MixpanelProvider>
    </>
  );
}

export default App;
