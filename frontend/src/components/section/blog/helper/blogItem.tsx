import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { BLOG } from '@/assets/images';
import { routes } from '@/routes/routes';

interface ItagProps {
  className?: string;
  tag: string;
}

interface BlogItemProps {
  id: string;
  className?: string;
  imageClassName?: string;
  image?: string;
  title: string;
  tags: ItagProps[];
  description?: string;
  titleClassName?: string;
  highlight?: string;
  createdAt: string;
}
export const BlogItem = ({
  id,
  className,
  imageClassName,
  title,
  image,
  createdAt,
  highlight,
}: BlogItemProps) => {
  const navigate = useNavigate();

  const regex = /[\[\]\s']/g;

  return (
    <div
      className={clsx(
        'flex flex-row  shadow-blogItem rounded-lg bg-white cursor-pointer overflow-hidden hover:scale-105 transition-all',
        className,
      )}
      onClick={() => {
        window.scrollTo(0, 0);
        navigate(routes.blogDetail.replace(':id', id));
      }}
    >
      <img
        src={image || BLOG.BlogImage}
        alt={title}
        className={clsx('min-h-[240px] max-h-[240px]  object-cover ', imageClassName)}
      />
      <div className="flex flex-col flex-1 justify-between gap-2 p-5 py-4 ">
        <div className="flex flex-col gap-2 bg-white">
          <h2 className="text-sm font-semibold text-purple-950 ">
            {format(parseISO(createdAt), 'PP')}
          </h2>
          <p className={clsx('font-semibold text-2xl mobile:text-xl text-gray-900  line-clamp-2')}>
            {title}
          </p>
          {highlight && (
            <p className="text-base font-normal mobile:text-sm mobile:line-clamp-4 text-gray-500 line-clamp-3">
              {highlight.replace(regex, ' ')}
            </p>
          )}
        </div>
        {/* <div className="flex flex-row gap-4"> */}
        {/* {tags.map((tag, index) => (
            <Badge
              key={index + tag.tag}
              className={clsx(
                'font-medium text-sm text-blue-700 bg-blue-50 ',
                tag.className,
              )}
            >
              {tag.tag}
            </Badge>
          ))} */}
        {/* </div> */}
      </div>
    </div>
  );
};
