import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';

import { useGetAssistantDetail } from '../../hooks/addAssistance';

interface SelectedAssistantProps {
  onClickChange: () => void;
  disabled?: boolean;
  chatbotId?: number;
}

export default function SelectedAssistant({
  onClickChange,
  disabled,
  chatbotId,
}: SelectedAssistantProps) {
  const [params] = useSearchParams();
  const assistant = params.get('assistant_id');

  const assistantDetaills = useGetAssistantDetail({
    id: assistant || chatbotId?.toString() || '',
  });

  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="flex gap-2 items-start text-sm text-gray-700 font-medium col-span-1">
        Leads Assistant
      </div>
      <div className="col-span-3 ">
        <p className="text-[#667085]">Assistant for this campaign</p>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2  mt-2">
            <RadioGroup value="1">
              <RadioGroupItem disabled className="w-5 h-5 mt-1" value={'1'} id={'assistant_1'} />
            </RadioGroup>
            <div className="flex  justify-center gap-2 flex-col">
              {assistantDetaills.isLoading ? (
                <>
                  <Skeleton className="w-[100px] h-[100px] bg-gray-200 rounded" />
                  <Skeleton className="w-[100px] h-5 bg-gray-200 rounded" />
                </>
              ) : (
                <>
                  <img
                    src={assistantDetaills.data?.avatar}
                    alt="Assistant"
                    className="w-[100px] h-[100px] rounded"
                  />
                  <p className="text-sm font-normal">{assistantDetaills.data?.name}</p>
                </>
              )}
            </div>
          </div>
          {!disabled && (
            <Button variant="dashed" onClick={onClickChange}>
              Change
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
