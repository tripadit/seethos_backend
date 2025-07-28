import { HomePageForm } from '@/components/section/home/components/homePageForm';

export const RequestInformation = () => {
  return (
    <div className="flex flex-col  w-full items-center justify-center gap-8">
      <div className="max-w-[500px] w-full">
        <h1 className="font-bold text-32 tracking-tight capitalize leading-[39px] text-white text-center">
          Free time for the most important things only you can do
        </h1>
      </div>
      <HomePageForm buttonText="Request Information" />
    </div>
  );
};
