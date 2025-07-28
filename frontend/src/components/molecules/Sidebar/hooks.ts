import { useQuery } from '@tanstack/react-query';

import { getEmailNotifications } from './api';

export const useGetEmailNotifications = () => {
  return useQuery(['notification'], {
    queryFn: getEmailNotifications,
  });
};
