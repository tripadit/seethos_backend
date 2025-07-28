import { differenceInDays } from 'date-fns';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useGetCurrentUserInfo } from '@/hooks/api';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import { useStore } from '@/store/store';

import { Header, Sidebar } from '..';

export const Layout = () => {
  const location = useLocation();
  const isDemoAccount = useStore((state) => state.isDemoAccount);
  const setIsDemoAccount = useStore((state) => state.setIsDemoAccount);

  const { data, isLoading: isFetching } = useGetCurrentUserInfo();
  React.useEffect(() => {
    if (data?.data && data?.data?.is_demo) {
      setIsDemoAccount(true);
    } else {
      setIsDemoAccount(false);
    }
  }, [data]);
  const isFreeAccount = React.useMemo(() => {
    if (data?.data && data?.data?.subscription_type === 'LOW') {
      const dateJoined = new Date(data?.data?.date_joined);
      const currentDate = new Date();
      return differenceInDays(currentDate, dateJoined) > 14;
    }
    return false;
  }, [data]);

  if (isFetching) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="w-40 h-40 flex flex-col items-center gap-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
            <path
              fill="none"
              stroke="#DC3450"
              stroke-width="15"
              stroke-linecap="round"
              stroke-dasharray="300 385"
              stroke-dashoffset="0"
              d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
            >
              <animate
                attributeName="stroke-dashoffset"
                calcMode="spline"
                dur="2"
                values="685;-685"
                keySplines="0 0 1 1"
                repeatCount="indefinite"
              ></animate>
            </path>
          </svg>
          <p>Loading...</p>
        </div>
        <div className="fixed bottom-0 flex items-center gap-2">
          <img src="/logo-black.png" alt="logo" className="w-full h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex  overflow-hidden">
      <aside className="h-screen z-50">
        <Sidebar />
      </aside>
      <div className="w-full h-screen overflow-hidden">
        <Header isDemoAccount={isDemoAccount} isFreeAccount={isFreeAccount} />

        <main
          className={cn('py-4 h-body overflow-auto relative px-8', {
            'h-body-with-tag': Boolean(isDemoAccount) || isFreeAccount,
            'pl-0 pr-0': location.pathname.includes(routes.addAssistantSuccess.replace('/:id', '')),
          })}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
