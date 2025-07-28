import { QueryCache, QueryClient } from '@tanstack/react-query';
const queryCache = new QueryCache();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      onError: () => {
        // Handle error on a global level
      },
    },
    mutations: {
      onError: () => {
        // Handle error on a global level
      },
      onSuccess: () => {
        // Handle success on a global level
      },
    },
  },
  queryCache,
});

export default queryClient;
