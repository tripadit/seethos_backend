import { TraditionalFlow, UnrealAiFlow, VS } from '@/assets/images';
import { SectionContainer } from '@/components/molecules/SectionContainer';

const ComparisonFlow = () => {
  return (
    <SectionContainer className="comparison-flow py-[100px]">
      <div className="flex flex-col lg:flex-row flex-1 h-full w-full justify-between items-center gap-10 ">
        <div className="flex flex-col flex-1 h-full gap-10 w-full max-w-[622px] items-center justify-end">
          <img
            src={TraditionalFlow}
            alt="traditional-flow"
            className="mobile:scale-125 scale-110"
          />

          <h1 className="font-bold text-[#111827] mobile:text-3xl text-[40px] text-center tracking-[-1px]">
            Traditional Marketing
          </h1>
        </div>
        <div>
          <img src={VS} alt="vs" className="w-[60px] h-[60px] object-cover" />
        </div>
        <div className="flex flex-col flex-1 items-center gap-10 max-w-[369px] w-full">
          <div>
            <img src={UnrealAiFlow} alt="unreal-flow" />
          </div>
          <h1 className="font-bold text-[#111827] mobile:text-3xl text-[40px] text-center tracking-[-1px] whitespace-nowrap">
            Unreal AI Marketing
          </h1>
        </div>
      </div>
    </SectionContainer>
  );
};

export default ComparisonFlow;
