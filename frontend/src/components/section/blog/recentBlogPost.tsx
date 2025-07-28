import { BLOG } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';

import { BlogItem } from './helper/blogItem';

export const RecentBlogPost = () => {
  return (
    <SectionContainer className="bg-[#fffbfb]">
      <div className="flex flex-col gap-8">
        <h1 className="font-semibold text-gray-900 text-2xl">Recent blog posts</h1>
        <div className="grid grid-cols-2 gap-10 h-[432px]">
          <BlogItem
            id=""
            createdAt=""
            image={BLOG.BlogImage}
            title="UX review presentations"
            highlight="How do you create compelling presentations that wow your colleagues and impress your managers?"
            // subTitle="Olivia Rhye • 20 Jan 2022"
            tags={[
              { tag: 'Design', className: 'text-purple-700 bg-purple-50' },
              { tag: 'Research' },
              { tag: 'Presentation', className: 'text-pink-700 bg-pink-50' },
            ]}
            className="h-[432px] flex-col w-full"
            imageClassName="w-full rounded-t-lg rounded-b-none rounded h-[48%]"
            titleClassName="line-clamp-3"
          />

          <div className="h-[432px] flex flex-col  justify-between">
            <BlogItem
              id=""
              createdAt=""
              image={BLOG.BlogImage2}
              title="UX review presentations"
              highlight="How do you create compelling presentations that wow your colleagues and impress your managers?"
              // subTitle="Olivia Rhye • 20 Jan 2022"
              tags={[{ tag: 'Design' }, { tag: 'Research', className: 'text-pink-700 bg-pink-50' }]}
              imageClassName="w-[60%] rounded-l-lg"
              titleClassName="text-lg line-clamp-3 "
            />
            <BlogItem
              id=""
              createdAt=""
              image={BLOG.BlogImage3}
              title="UX review presentations"
              highlight="How do you create compelling presentations that wow your colleagues and impress your managers?"
              // subTitle="Olivia Rhye • 20 Jan 2022"
              tags={[{ tag: 'Design' }, { tag: 'Research', className: 'text-pink-700 bg-pink-50' }]}
              imageClassName="w-[60%] rounded-l-lg"
              titleClassName="text-lg line-clamp-3 "
            />
          </div>
        </div>
        <BlogItem
          id=""
          createdAt=""
          image={BLOG.BlogImage2}
          title="Grid system for better Design User Interface"
          highlight="A grid system is a design tool used to arrange content on a webpage. It is a series of vertical and horizontal lines that create a matrix of intersecting points, which can be used to align and organize page elements. Grid systems are used to create a consistent look and feel across a website, and can help to make the layout more visually appealing and easier to navigate."
          // subTitle="Olivia Rhye • 1 Jan 2023"
          tags={[
            { tag: 'Design', className: 'text-purple-700 bg-purple-50' },
            { tag: 'interface', className: 'text-pink-700 bg-pink-50' },
          ]}
          imageClassName="w-[50%] rounded-l-lg"
          className="h-[300px]"
          titleClassName="line-clamp-6"
        />
      </div>
    </SectionContainer>
  );
};
