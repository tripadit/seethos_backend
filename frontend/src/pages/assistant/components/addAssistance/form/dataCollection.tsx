import { Grip, PlusIcon, RefreshCcw } from 'lucide-react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { ArrowBlockLeft, DeleteIcon } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AssistantDataCollectionFormSchemaType } from '@/pages/assistant/routes/addAssistance';

import { StrictModeDroppable } from './helper/strictModeDragDropContext';
interface IDataCollectionProps {
  form: UseFormReturn<AssistantDataCollectionFormSchemaType>;
  handleBack: () => void;
  handleCreateAssistant: () => void;
  isLoading: boolean;
  isUpdateMode?: boolean;
}
export const DataCollection = ({
  form,
  handleBack,
  handleCreateAssistant,
  isLoading,
  isUpdateMode,
}: IDataCollectionProps) => {
  const { fields, append, remove, swap } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'question', // unique name for your Field Array
  });
  return (
    <div>
      <Form {...form}>
        <div className="grid gap-4 py-2 col-span-2">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="question"
            render={() => (
              <FormItem>
                <div className="flex flex-col w-full gap-2">
                  <FormLabel className="text-sm text-gray-700">
                    Data that you want your assistant to collect from your visitors
                  </FormLabel>
                  <p className="text-gray-1000 font-normal text-sm">
                    Your data collection will seamlessly sync with your CRM leads table. For optimal
                    results, ensure your collection includes name, email, and phone number for
                    comprehensive lead management.
                  </p>
                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;
                      swap(result.destination.index, result.source.index);
                    }}
                  >
                    <StrictModeDroppable droppableId="droppable">
                      {(provided) => (
                        <div
                          className="flex flex-col gap-4 mt-5"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {fields.map((field: any, index) => (
                            <Draggable draggableId={field.id} index={index} key={field.id}>
                              {(provided) => (
                                <div
                                  className="gap-5 grid grid-cols-9  w-full items-center"
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                >
                                  <div className="flex flex-row gap-2 col-span-2 items-center">
                                    <div {...provided.dragHandleProps}>
                                      <Grip className="text-[#667085]" size={16} />
                                    </div>
                                    <FormLabel className="text-sm  font-normal whitespace-nowrap">
                                      Questions 0{index + 1}
                                    </FormLabel>
                                  </div>
                                  <div className="w-full col-span-6 flex-1">
                                    <Input
                                      className="w-full"
                                      key={field.id} // important to include key with field's id
                                      {...form.register(`question.${index}.value`)}
                                    />
                                  </div>
                                  <div className="">
                                    <div
                                      className="w-min hover:bg-gray-100 cursor-pointer p-2 rounded"
                                      onClick={() => {
                                        remove(index);
                                      }}
                                    >
                                      <DeleteIcon />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </StrictModeDroppable>
                  </DragDropContext>

                  <div className="grid grid-cols-9 mt-2">
                    <div className="col-span-2" />
                    <div className="col-span-6">
                      <Button
                        onClick={() => {
                          append({ value: '' });
                        }}
                        variant={'ghost'}
                        className="w-fit text-base text-purple-500 hover:text-purple-500 hover:bg-purple-50"
                        icon={<PlusIcon />}
                      >
                        Add Question
                      </Button>
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-9 mt-2">
            <div className="col-span-2" />
            <div className="col-span-6">
              <div className="w-full flex flex-col gap-1">
                <div className="flex items-center gap-3 ">
                  <Button
                    type="submit"
                    variant="outline"
                    icon={<ArrowBlockLeft />}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateAssistant}
                    type="submit"
                    variant="purple"
                    isLoading={isLoading}
                    disabled={isLoading}
                    icon={<RefreshCcw size={16} />}
                  >
                    {isUpdateMode ? 'Update Assistant' : 'Create Assistant'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
