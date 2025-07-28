import { useInfiniteQuery } from '@tanstack/react-query';

import { CONFIG } from '@/global/config';
import { endpoints } from '@/global/endpoints';

export function useFetchBlogs() {
  const fetchBlogs = async ({ pageParam }: any) => {
    const baseURL = CONFIG.NEWSLETTER_URL;
    const res = await fetch(baseURL + endpoints.blogs.allBlogs + `&page=${pageParam ?? 1}`);
    if (res) {
      const data = await res.json();
      return data;
    }
  };

  return useInfiniteQuery({
    queryKey: ['all-blogs'],
    queryFn: ({ pageParam }) => fetchBlogs({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? lastPage.next : undefined;
    },
  });
}
