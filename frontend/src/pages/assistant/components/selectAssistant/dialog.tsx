import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { WarningIcon } from '@/assets/icons';
import { CustomDialog } from '@/components/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchChatBot } from '@/hooks/api';

interface SelectAssistantDialogProps {
  title: string;
  description: string;
  onSelectAssistant: (id: number) => void;
  onCreateAssistant: () => void;
  onClose: () => void;
}
export default function SelectAssistantDialog(props: SelectAssistantDialogProps) {
  const { title, description, onSelectAssistant, onCreateAssistant, onClose } = props;

  const { data, isLoading } = useFetchChatBot('');

  const [value, setValue] = useState('');

  const [params] = useSearchParams();

  const assistantId = params.get('assistant_id') || '';

  useEffect(() => {
    if (assistantId) {
      setValue(assistantId);
    }
  }, [data]);

  return (
    <>
      <CustomDialog
        title={title}
        isOpen={true}
        onClose={() => {
          onClose();
        }}
        className="max-w-[619px]"
        body={
          <>
            <div className="text-gray-500">{description}</div>
            <RadioGroup
              value={value}
              onValueChange={(val) => {
                setValue(val);
              }}
            >
              <div className="grid grid-cols-3 gap-5">
                {data?.data
                  ?.filter(
                    (assistant: any) => assistant.status && assistant.traning_status === 'TRAINED',
                  )
                  .map((assistant: any) => (
                    <div className="flex items-start gap-2 justify-center">
                      <div>
                        <RadioGroupItem
                          className="w-5 h-5 mt-1"
                          value={assistant.id.toString()}
                          id={'assistant_' + assistant.id.toString()}
                        />
                      </div>
                      <Label
                        htmlFor={'assistant_' + assistant.id.toString()}
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <img
                          src={assistant.avatar}
                          alt="Assistant"
                          className="w-[100px] h-[100px] rounded"
                        />
                        <p className="text-sm font-normal">{assistant.name}</p>
                      </Label>
                    </div>
                  ))}
                {!isLoading && data?.data?.length > 0 && (
                  <>
                    <div
                      onClick={onCreateAssistant}
                      className="flex cursor-pointer items-center justify-center h-[100px] w-[120px] border rounded text-center text-sm font-medium text-purple-600  border-purple-600 border-dashed"
                    >
                      Create New <br />
                      Assistant
                    </div>
                  </>
                )}
                {isLoading &&
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-start gap-2">
                      <RadioGroupItem value={i.toString()} id={'assistant_' + i} disabled />
                      <Skeleton className="w-[100px] h-[100px] bg-neutral-300" />
                    </div>
                  ))}
              </div>
            </RadioGroup>
            {!isLoading && data?.data?.length == 0 && (
              <div className="flex flex-col py-5 border border-gray-200 rounded-lg w-full items-center justify-center">
                <WarningIcon className="w-20 h-20 text-yellow-500" />
                <div className="text-center text-gray-600 font-bold text-[24px] leading-[30px] px-3">
                  No assistants created. <br />
                  Create an assistant first to get started.
                </div>
                <div className="text-center text-wrap px-4 text-gray-600 mt-1">
                  An assistant needs to be assigned to the campaign so you need to begin with
                  creating an assistant first.
                </div>
              </div>
            )}
            <div className="flex gap-4 justify-center w-full">
              <Button
                variant={'outline'}
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                variant={'purple'}
                onClick={() => {
                  if (!isLoading && data?.data?.length == 0) {
                    onCreateAssistant();
                    return;
                  }
                  if (!value) return;
                  onSelectAssistant(parseInt(value));
                }}
              >
                {!isLoading && data?.data?.length == 0 ? 'Create Assistant' : 'Continue'}
              </Button>
            </div>
          </>
        }
      />
    </>
  );
}
