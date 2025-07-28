import { MailIcon } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { useDeleteSequenceMutation } from '@/pages/campaignManagement/hooks/campaignManagement.tsx';

interface IEmailSequenceCardProps {
  index: number;
  sequence: {
    subject: string;
    body: string;
    delay: number;
    delayUnit: string;
    id?: number;
  };
  handleInputChange: (index: number, e: any) => void;
  handleRemoveSequence: (index: number) => void;
  emailSequence: any;
}

export default function EmailSequenceCard({
  index,
  sequence,
  handleInputChange,
  handleRemoveSequence,
  emailSequence,
}: IEmailSequenceCardProps) {
  const deleteEmailSequence = useDeleteSequenceMutation();

  return (
    <>
      <div key={index} className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="rounded-lg border p-2">
            <MailIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium ">Email {index + 1}</h3>
        </div>
        <div className="grid grid-cols-5 mb-6">
          <label className="col-span-1 font-medium">Subject</label>
          <Input
            className="col-span-4"
            type="text"
            name="subject"
            value={sequence.subject}
            onChange={(e) => handleInputChange(index, e)}
          />
        </div>
        <div className="grid grid-cols-5 mb-6">
          <label className="col-span-1 font-medium">Body</label>
          <ScrollArea className="col-span-4 p-2 border border-gray-200 rounded-lg min-h-40 pr-5 overflow-y-auto">
            <div
              className="outline-none !min-h-[136px]"
              contentEditable={true}
              onInput={(e) => {
                handleInputChange(index, {
                  target: {
                    name: 'body',
                    value: e.currentTarget.innerHTML,
                  },
                });
              }}
            />
          </ScrollArea>
        </div>
        <div className="flex flex-row gap-6">
          <label className="basis-1/6 font-medium">Delay</label>
          <div className="col-span-1">
            <Input
              type="number"
              name="delay"
              min={1}
              max={sequence.delayUnit === 'hours' ? 24 : sequence.delayUnit === 'days' ? 15 : 60}
              value={sequence.delay}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div className="">
            <Select
              name="delayUnit"
              value={sequence.delayUnit}
              onValueChange={(value) =>
                handleInputChange(index, {
                  target: { name: 'delayUnit', value },
                })
              }
            >
              <SelectTrigger className="w-full">
                <span>
                  {sequence.delayUnit === 'hours'
                    ? 'Hours'
                    : sequence.delayUnit === 'days'
                      ? 'Days'
                      : 'Minutes'}
                </span>{' '}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-start gap-5 mt-5">
          {emailSequence?.length > 1 && (
            <Dialog>
              <DialogTrigger>
                <Button variant="dashed" className="mb-4" type="button">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="font-medium">
                  Are you sure to delete this sequence?
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <DialogClose>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (sequence.id) {
                          const response: any = await deleteEmailSequence.mutateAsync(sequence.id);
                          if (response.data) {
                            handleRemoveSequence(index);
                          } else {
                            toast({
                              variant: 'destructive',
                              title: 'Could not delete sequence',
                            });
                          }
                        } else {
                          handleRemoveSequence(index);
                        }
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Separator className="mb-10" />
      </div>
    </>
  );
}
