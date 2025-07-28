import { SubmitHandler, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCreateSenderEmail } from '@/pages/campaignManagement/hooks/campaignManagement';

import { SenderEmailFormType } from '../form';
import { SenderEmailsList } from './senderEmailsList';

export const SenderEmails = ({
  senderEmailform,
  isViewMode,
  inputFieldClassName,
}: {
  senderEmailform: UseFormReturn<SenderEmailFormType>;
  isViewMode?: boolean;
  inputFieldClassName?: string;
}) => {
  const addSenderEmail = useCreateSenderEmail();
  const onSubmit: SubmitHandler<SenderEmailFormType> = async (data) => {
    const response = await addSenderEmail.mutateAsync(data);
    if (response) {
      senderEmailform.reset({ email: '' });
    }
  };

  return (
    <Form {...senderEmailform}>
      <FormField
        control={senderEmailform.control}
        name="email"
        disabled={isViewMode}
        render={({ field }) => (
          <FormItem className="grid grid-cols-4">
            <FormLabel className="md:text-sm col-span-1">Sender Emails</FormLabel>
            <div className={cn('m-0 w-full flex flex-col gap-1 col-span-3', inputFieldClassName)}>
              <SenderEmailsList isViewMode={isViewMode} />
              <div className="flex flex-row gap-2">
                <div className={cn('w-full')}>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
                <Button
                  disabled={isViewMode}
                  onClick={senderEmailform.handleSubmit(onSubmit)}
                  variant={'outline'}
                  isLoading={addSenderEmail.isLoading}
                  className="px-4 py-1 bg-white  text-black"
                >
                  Save
                </Button>
              </div>
            </div>
          </FormItem>
        )}
      />
    </Form>
  );
};
