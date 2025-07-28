interface IAddAssistanceProgressBar {
  progressBarInfo: {
    progress?: number;
    message?: string;
  };
}
export const AddAssistanceProgressBar = ({ progressBarInfo }: IAddAssistanceProgressBar) => {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="max-w-[582px] w-full">
        <h1 className="text-base font-semibold text-gray-900 text-center">
          {progressBarInfo.message}
        </h1>
        <div className="flex flex-row gap-2 items-center">
          <div className="h-[8px] w-full bg-[#EAECF0] rounded">
            <div
              className="bg-purple-500 rounded-full h-full"
              style={{
                width: `${progressBarInfo?.progress}%`,
              }}
            ></div>
          </div>
          <p className="font-bold text-sm text-black/75">{progressBarInfo.progress}%</p>
        </div>
      </div>
    </div>
  );
};
