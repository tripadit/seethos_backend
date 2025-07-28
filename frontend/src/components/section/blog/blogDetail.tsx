import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import HtmlParse from 'html-react-parser';
import parse from 'node-html-parser';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import emptyBlog from '@/assets/emptyblog.gif';
import { BLOG } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchBlogDetail } from '@/hooks/api/landing/useFetchBlogsDetails';

const BlogDetailSection = () => {
  const param = useParams();

  const { data, isLoading, error } = useFetchBlogDetail(param.id as string);

  const getContent = useMemo(() => {
    if (data?.contents) {
      const parsedContent = parse(data?.contents);
      const regex = /[\[\]\s']/g;
      const paragraphs = parsedContent.querySelectorAll('p');
      if (paragraphs.length >= 1 && data?.highlight) {
        const secondParagraph = paragraphs[0];
        secondParagraph.insertAdjacentHTML(
          'afterend',
          `<p className="highlight-text">${data?.highlight?.replace(regex, ' ')}</p>`,
        );
      }
      return parsedContent.toString();
    }
  }, [data]);

  if (isLoading) {
    return (
      <SectionContainer className="bg-[#fffbfb] py-20 min-h-[80vh]">
        <div className="w-full flex flex-col gap-10">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />

          <Skeleton className="h-[30px] w-full" />
          <Skeleton className="h-[30px] w-full" />
          <Skeleton className="h-[30px] w-full" />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer className="bg-[#fffbfb] py-20 min-h-[80vh]">
      {data && (
        <div>
          <img
            src={data?.coverPicture || BLOG.BlogImage}
            alt={data?.title}
            className={clsx('max-h-[400px] w-full h-full rounded-md object-cover ')}
          />
          <div className="my-5  border-b-2 flex flex-col gap-3 pb-3">
            <h1
              className={clsx(
                'font-semibold text-5xl mobile:text-3xl text-gray-900  laptop:line-clamp-2',
              )}
            >
              {data?.title}
            </h1>
            <h2 className="text-sm font-semibold text-purple-950 ">
              {format(parseISO(data?.created_at), 'PP')}
            </h2>
          </div>
          <div className="my-5 flex flex-col gap-4">
            <div className="blog-detail-content">{HtmlParse(getContent as string)}</div>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full flex-1 items-center flex flex-col text-center bg-white rounded-xl p-20 small:p-5">
          <img src={emptyBlog} alt="no-blogs" className="w-max h-[300px] object-cover" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Oops! Something went wrong while fetching the blogs.{' '}
          </h3>
          <p className="text-sm mt-3 text-gray-800">Please refresh the page or try again later.</p>
        </div>
      )}
    </SectionContainer>
  );
};

export default BlogDetailSection;
