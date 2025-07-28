import { useCallback, useEffect, useMemo, useRef } from 'react';

import emptyBlog from '@/assets/emptyblog.gif';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchBlogs } from '@/hooks/api/landing/useFetchBlogs';

import { BlogItem } from './helper/blogItem';

interface IBlog {
  id: string;
  title: string;
  contents: string;
  coverPicture?: string;
  highlight: string;
  created_at: string;
  shared_to_free: boolean;
}

export const AllBlogs = () => {
  const observer = useRef<IntersectionObserver>();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetching } = useFetchBlogs();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );

  const blogs = useMemo(() => {
    return data?.pages?.reduce((acc, page) => {
      return [...acc, ...(page.data ?? [])];
    }, []);
  }, [data]);

  return (
    <SectionContainer className="bg-[#fffbfb] py-20 min-h-[80vh]">
      <div className="flex flex-col gap-8 ">
        <h1 className="font-semibold text-gray-900 text-2xl">Blogs</h1>
        {blogs && !!blogs?.length && (
          <div className="grid grid-cols-3 small:grid-cols-1 gap-10">
            {blogs?.map((blog: IBlog, idx: number) => {
              if (blog.shared_to_free) {
                return (
                  <div key={blog.id + idx} ref={lastElementRef}>
                    <BlogItem
                      id={blog.id}
                      image={blog.coverPicture}
                      title={blog.title}
                      highlight={blog.highlight}
                      createdAt={blog.created_at}
                      tags={[
                        { tag: 'Design', className: 'text-purple-700 bg-purple-50' },
                        { tag: 'Research' },
                        { tag: 'Presentation', className: 'text-pink-700 bg-pink-50' },
                      ]}
                      className="h-[450px] flex-col w-full"
                      imageClassName="w-full rounded-t-lg rounded-b-none rounded"
                      titleClassName="line-clamp-3"
                    />
                  </div>
                );
              }
            })}
          </div>
        )}

        {(isLoading || isFetching) && (
          <SectionContainer className="bg-[#fffbfb] py-20 min-h-[60vh]">
            <div className="w-full grid grid-cols-3 small:grid-cols-1 gap-10">
              <Skeleton className="h-[350px] w-full" />
              <Skeleton className="h-[350px] w-full" />
              <Skeleton className="h-[350px] w-full" />

              <Skeleton className="h-[350px] w-full" />
              <Skeleton className="h-[350px] w-full" />
              <Skeleton className="h-[350px] w-full" />
            </div>
          </SectionContainer>
        )}

        {((blogs && !blogs.length) || error) && (
          <div className="w-full flex-1 items-center flex flex-col text-center bg-white rounded-xl p-20 small:p-5">
            <img src={emptyBlog} alt="no-blogs" className="w-max h-[300px] object-cover" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Empty blog shelves today, but we're in the kitchen cooking up fresh ideas.{' '}
            </h3>
            <p className="text-sm mt-3 text-gray-800">
              Check back soon for a feast of insightful articles!
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
};
