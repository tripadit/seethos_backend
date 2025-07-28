import { AddIcon } from '@/assets/icons';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface IDataCollection {
  questions: number;
  setQuestions: any;
  questionValue: string[];
  setQuestionValue: any;
}

export const DataCollection = ({
  questions,
  setQuestions,
  questionValue,
  setQuestionValue,
}: IDataCollection) => {
  const handleQuestionChange = (value: string, index: number) => {
    const updatedValues = [...questionValue];
    updatedValues[index] = value;
    setQuestionValue(updatedValues);
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Data Collection */}
      <div className="grid grid-cols-1 gap-6">
        <FormLabel className="min-w-170">
          What information would you like to gather from your website guests?
        </FormLabel>
        <div className="w-full flex flex-col gap-4">
          {Array.from({ length: questions }, (_, index) => index).map((idx) => (
            <div className="flex items-center gap-3" key={idx}>
              <Input
                placeholder="Tell me more about your company?"
                className="m-0 "
                value={questionValue[idx] || ''}
                onChange={(e) => handleQuestionChange(e.target.value, idx)}
              />
            </div>
          ))}

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setQuestions(questions + 1)}
          >
            <AddIcon className="question-add-icon" width={16} height={16} />
            <p className="text-purple-500 text-base font-medium">Add an Item </p>
          </div>
        </div>
      </div>
    </div>
  );
};
