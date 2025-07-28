import { useQuery } from '@tanstack/react-query';

import { CONFIG } from '@/global/config';
import { endpoints } from '@/global/endpoints';

export function useFetchBlogDetail(id: string, rest: any = {}) {
  const fetchBlogDetail = async () => {
    const baseURL = CONFIG.NEWSLETTER_URL;
    try {
      const res = await fetch(baseURL + endpoints.blogs.blogDetail.replace(':id', id));
      const data = await res.json();
      return data;
    } catch (err) {
      throw new Error('Could not copy to clipboard: ' + err);
    }
  };

  return useQuery(['fetch', 'blogs-detail'], fetchBlogDetail, {
    enabled: !!id,
    ...rest,
  });
}
