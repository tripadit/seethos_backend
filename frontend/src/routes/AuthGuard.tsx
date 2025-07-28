import { Navigate, Outlet } from 'react-router-dom';

import tokenService from '@/utils/token';

import { routes } from './routes';

export const PublicRoutes = () => {
  const accessToken = tokenService.getAccessToken();
  if (accessToken) {
    return <Navigate to={routes.dashboard} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export const PrivateRoutes = () => {
  const accessToken = tokenService.getAccessToken();
  if (!accessToken) {
    return <Navigate to={routes.signIn} />;
  }

  return <Outlet />;
};
