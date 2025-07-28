import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const BlogHeroSection = () => {
  return (
    <SectionContainer className="py-20 bg-[#fffbfb]">
      <div className=" w-full bg-blue-400 h-[450px] rounded-lg flex flex-col justify-end">
        <div className="flex flex-col gap-4 p-10 max-w-[850px] w-full">
          <Badge className="bg-blue-500 w-fit font-medium text-white rounded-sm text-sm py-1">
            Technology
          </Badge>
          <h1 className="text-white  text-4xl font-semibold">
            The Impact of Technology on the Workplace: How Technology is Changing
          </h1>
          <div className="flex flex-row gap-5 text-white items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h2 className="text-base font-medium">Tracey Wilson</h2>
            <h2 className="text-base font-medium">August 20, 2022</h2>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
