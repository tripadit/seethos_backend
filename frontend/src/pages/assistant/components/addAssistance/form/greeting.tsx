import { PlusIcon } from 'lucide-react';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { ArrowBlockLeft } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { OneClickOption, THEMEOPTION } from '@/pages/assistant/constant/addAssistance';
import { AssistanceGreetingFormSchemaType } from '@/pages/assistant/routes/addAssistance';

import { ColorPicker } from './helper/colorPicker';
import { OneClickItem } from './helper/oneClickItem';
interface IAssistanceGreetingProps {
  form: UseFormReturn<AssistanceGreetingFormSchemaType>;
  handleNextTraningDetails: (tab: '1' | '2' | null, isChangeStep: boolean, isBack: boolean) => void;
}
export const AssistanceGreeting = ({
  handleNextTraningDetails,
  form,
}: IAssistanceGreetingProps) => {
  const [greetingTags, setGreetingTags] = React.useState<string>('');
  const [greetingTagsOption, setGreetingTagsOption] = React.useState<string[]>(OneClickOption);
  React.useEffect(() => {
    const greetingTag = form.getValues('greeting_tags');
    if (greetingTag && greetingTag?.length > 0) {
      setGreetingTagsOption([...new Set([...greetingTag, ...OneClickOption])]);
    }
  }, []);
  return (
    <div>
      <Form {...form}>
        <div className="grid gap-4 py-2 col-span-2">
          {/* Company Name */}

          <FormField
            control={form.control}
            name="custom_prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="md:text-sm ">Custom Prompt</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <Textarea
                    id="name"
                    rows={15}
                    placeholder="Write a custom system prompt for the assistant."
                    className="col-span-4"
                    {...field}
                  />
                  <FormMessage className="w-full" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="greeting_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="md:text-sm ">Greeting Message</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
                  <Textarea
                    id="name"
                    placeholder="Good morning, my name is [FIRST_NAME], I'm [BUSINESS_NAME]'s assistant.  Is there anything I can quickly help you with?"
                    className="col-span-4"
                    {...field}
                  />
                  <FormMessage className="w-full" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="greeting_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">One-Click Easy Options</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-2">
                  <p className="text-gray-1000 font-normal text-base">
                    Select one-click easy options for your clients.
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {greetingTagsOption.map((item) => (
                      <OneClickItem
                        key={item}
                        text={item}
                        isActive={field?.value?.includes(item)}
                        onClick={() => {
                          const values = field?.value ?? [];
                          if (values.includes(item)) {
                            field.onChange(values.filter((el) => el !== item));
                          } else {
                            field.onChange([...values, item]);
                          }
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <p className="text-[#4B5563] font-normal text-sm">
                      or Write your own personalized easy options
                    </p>
                    <div className="flex flex-row gap-5">
                      <Input
                        id="name"
                        className="col-span-4"
                        value={greetingTags}
                        onChange={(e) => {
                          setGreetingTags(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setGreetingTags('');
                            setGreetingTagsOption([
                              ...new Set([...greetingTagsOption, greetingTags]),
                            ]);
                            field.onChange([...new Set([...field.value, greetingTags])]);
                          }
                        }}
                      />
                      <Button
                        variant={'outline'}
                        icon={<PlusIcon />}
                        onClick={() => {
                          setGreetingTags('');
                          setGreetingTagsOption([
                            ...new Set([...greetingTagsOption, greetingTags]),
                          ]);
                          field.onChange([...new Set([...field.value, greetingTags])]);
                        }}
                      />
                    </div>
                    <FormMessage className="w-full" />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Brand Color</FormLabel>
                <div className="m-0 md:max-w-md w-full flex flex-col gap-1 ">
                  <div className="relative w-full">
                    <div
                      className={`left-2 top-1/2 absolute -translate-y-1/2 transform right-2 h-4 w-4  z-10`}
                      style={{ backgroundColor: field.value }}
                    ></div>
                    <ColorPicker field={field} />
                  </div>
                  <FormMessage className="w-full" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Chat Theme</FormLabel>
                <div className="m-0 md:max-w-md  w-full flex flex-col gap-5">
                  <RadioGroup
                    className="m-0 w-full  flex flex-wrap gap-5"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    {THEMEOPTION.map((el) => {
                      return (
                        <div className="flex space-x-2 items-center">
                          <RadioGroupItem value={el} id={el} />
                          <FormLabel htmlFor={el} className="font-normal text-base">
                            {el}
                          </FormLabel>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <FormMessage className="w-full" />
                </div>
              </FormItem>
            )}
          />
          <FormItem>
            <div></div>
            <div className="m-0 md:max-w-md w-full flex flex-col gap-1">
              <div className="flex items-center gap-3 ">
                <Button
                  type="submit"
                  variant="outline"
                  onClick={() => handleNextTraningDetails('1', true, true)}
                  icon={<ArrowBlockLeft />}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="purple"
                  icon={<ArrowBlockLeft className="-rotate-180" />}
                  onClick={() => handleNextTraningDetails('2', true, false)}
                >
                  Next
                </Button>
              </div>
            </div>
          </FormItem>
        </div>
      </Form>
    </div>
  );
};
