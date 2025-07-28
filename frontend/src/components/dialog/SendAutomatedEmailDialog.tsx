import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm, UseFormReturn } from 'react-hook-form';

import {
  addSenderEmailSchema,
  SenderEmailFormType,
} from '@/pages/campaignManagement/components/createCampaign/form';
import { SenderEmails } from '@/pages/campaignManagement/components/createCampaign/helper/senderEmails';
import { useGetSenderEmailList } from '@/pages/campaignManagement/hooks/campaignManagement';
import { SendAutomatedEmailFormType } from '@/pages/leadGeneration/components/CreateLead';

import { useGetAllDomains } from '../domains/hooks/hooks';
import { Button } from '../ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CustomDialog } from '.';

interface SendAutomatedEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<SendAutomatedEmailFormType>;
  onContinue: () => void;
}

export const SendAutomatedEmailDialog = ({
  isOpen,
  onClose,
  form,
  onContinue,
}: SendAutomatedEmailDialogProps) => {
  const { data } = useGetAllDomains();

  const { data: senderEmails, isLoading } = useGetSenderEmailList();

  const handleClickOnContinue = async (event: any) => {
    event.preventDefault();

    const isFormValid = await form.trigger();
    if (senderEmails && senderEmails?.data?.length < 1) return;
    if (!isFormValid) return;
    onClose();
    onContinue();
  };

  const validateEmail = (email: string) => {
    return (
      data &&
      data.data &&
      data.data.some((domain: any) => {
        if (email.includes(domain.domain)) {
          return true;
        }
      })
    );
  };

  const senderEmailform = useForm<SenderEmailFormType>({
    resolver: zodResolver(addSenderEmailSchema(validateEmail)),
    defaultValues: {},
  });

  return (
    <>
      <CustomDialog
        title="Send Automated Email"
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        className="lg:min-w-[616px]"
        body={
          <Form {...form}>
            <div className="gap-4 flex flex-col ">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4">
                    <FormLabel className="md:text-sm col-span-1 ">Email Prompt</FormLabel>
                    <div className="flex flex-col gap-3 col-span-3">
                      <span className="text-gray-600">
                        Write prompt to generate your email description.
                      </span>
                      <div className="flex-1">
                        <Textarea placeholder="" className="mb-2" {...field} />
                        <FormMessage className="w-full" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4">
                    <FormLabel className="md:text-sm col-span-1">Subject</FormLabel>
                    <div className="flex flex-col gap-2 col-span-3">
                      <Input placeholder="" className="mb-2" {...field} />
                      <FormMessage className="w-full" />
                    </div>
                  </FormItem>
                )}
              />

              <SenderEmails senderEmailform={senderEmailform} />
              {!isLoading && senderEmails && senderEmails?.data?.length < 1 && (
                <div className="flex w-full">
                  <div className="basis-1/3" />
                  <div className="basis-2/3 font-medium text-destructive text-sm w-full">
                    At least one mail is required
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="reply_email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4">
                    <FormLabel className="md:text-sm col-span-1">Reply Email</FormLabel>
                    <div className="flex flex-col gap-2 col-span-3">
                      <Input
                        placeholder="Add a email to include in closed caption"
                        type="email"
                        className="mb-2"
                        {...field}
                      />
                      <FormMessage className="w-full" />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex w-full grid grid-cols-4">
                <div className="col-span-1" />
                <div className="col-span-3">
                  <Button
                    variant="purple"
                    icon={<Send className="rotate-45 basis-2/3" />}
                    onClick={handleClickOnContinue}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        }
      />
    </>
  );
};
