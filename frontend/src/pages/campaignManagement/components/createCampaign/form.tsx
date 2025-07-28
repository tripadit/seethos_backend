import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontalIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { useGetAllDomains } from '@/components/domains/hooks/hooks';
import { SingleImageUpload } from '@/components/molecules';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import SelectAssistantDialog from '@/pages/assistant/components/selectAssistant/dialog';
import SelectedAssistant from '@/pages/assistant/components/selectAssistant/selectedAssistant';
import { routes } from '@/routes/routes';

import { CAMPAIGNSTATUS } from '../../constant/campaignManagement';
import {
  useCreateCampaign,
  useGetSenderEmailList,
  useTestEmailCampaignEmail,
} from '../../hooks/campaignManagement';
import { ICampaingnList } from '../../types/campaingn';
import { SenderEmails } from './helper/senderEmails';

export const addSenderEmailSchema = (validateFn: (email: string) => boolean) => {
  return z.object({
    email: z
      .string({ required_error: 'Sender Email is required*' })
      .email('Please enter a valid email address')
      .refine(validateFn, { message: 'Email of only validated domain is allowed' }),
  });
};
export const CreateCampaignFormSchema = z.object({
  prompt: z.string({ required_error: 'Prompt is required*' }),
  subject: z.string({ required_error: 'Subject is required*' }),
  file: z.any().refine((files) => files?.length == 1, 'Leads List is required*'),
  follow_up_prompt: z.string().optional(),
  reply_email: z
    .string()
    .refine((email: string) => {
      return email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
    }, 'Enter a valid email')
    .optional(),
});
export type SenderEmailFormType = z.infer<any>;
export type CreateCampaignFormType = z.infer<typeof CreateCampaignFormSchema>;
export const CreateCampaignForm = ({
  campaign,
  isViewMode,
}: {
  campaign?: ICampaingnList;
  isViewMode?: boolean;
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const senderEmailList = useGetSenderEmailList();
  const createCampaign = useCreateCampaign();
  const { data } = useGetAllDomains();

  const [params, setParams] = useSearchParams();

  const assistant_id = params.get('assistant_id');
  const testCampaignEmails = useTestEmailCampaignEmail();

  const [selectAssistantOpen, setSelectAssistantOpen] = useState(false);

  const navigate = useNavigate();

  const form = useForm<CreateCampaignFormType>({
    resolver: zodResolver(CreateCampaignFormSchema),
    defaultValues: React.useMemo(() => {
      return {
        prompt: campaign?.prompt || '',
        subject: campaign?.subject || '',
        file: null,
        follow_up_prompt: campaign?.follow_up_prompt || '',
      };
    }, [campaign]),
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        prompt: campaign.prompt || '',
        subject: campaign.subject || '',
        file: null,
        follow_up_prompt: campaign.follow_up_prompt || '',
      });
    }
  }, [campaign]);
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
  const onSubmit: SubmitHandler<CreateCampaignFormType> = async (data) => {
    if (senderEmailList.data?.data.length === 0) {
      senderEmailform.setError('email', { message: 'Please add atleast one sender email' });
      return;
    }
    if (!assistant_id) {
      toast({
        title: 'Please select an assistant',
        variant: 'destructive',
      });
      return;
    }
    const formData = new FormData();
    formData.append('prompt', data.prompt);
    formData.append('subject', data.subject);
    formData.append('chatbot', assistant_id);
    formData.append('reply_email', data?.reply_email || '');
    formData.append('file', file as File);
    const response = await createCampaign.mutateAsync(formData);
    if (response) {
      const res = await testCampaignEmails.mutateAsync(response.id);
      if (res) {
        form.reset({
          prompt: '',
          subject: '',
          file: null,
        });
        setFile(null);
        navigate('/dashboard/campaign-review/' + response.id);
      }
    }
  };
  return (
    <div>
      <Form {...form}>
        <div className="flex flex-col  gap-5">
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-4">
              {isViewMode && (
                <FormItem className="grid grid-cols-4">
                  <FormLabel className="md:text-sm col-span-1">Campaign Status</FormLabel>
                  <div className="m-0  w-full flex flex-row justify-between items-center gap-1 col-span-3">
                    <Badge
                      variant={
                        campaign?.status == CAMPAIGNSTATUS.ACTIVE
                          ? 'success'
                          : campaign?.status == CAMPAIGNSTATUS.DRAFT
                            ? 'warning'
                            : 'successDark'
                      }
                      className="uppercase w-fit"
                    >
                      {campaign?.status}
                    </Badge>
                    <Badge
                      variant={'default'}
                      className="text-purple-500 w-fit text-base font-semibold"
                    >
                      {campaign?.number_of_emails_sent} emails sent
                    </Badge>
                  </div>
                </FormItem>
              )}
              <SelectedAssistant
                disabled={isViewMode}
                onClickChange={() => {
                  setSelectAssistantOpen(true);
                }}
                chatbotId={isViewMode ? campaign?.chatbot : undefined}
              />
              <FormField
                control={form.control}
                name="prompt"
                disabled={isViewMode}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4">
                    <FormLabel className="md:text-sm col-span-1">Email Prompt</FormLabel>
                    <div className="m-0  w-full flex flex-col gap-1 col-span-3">
                      <p className="text-base text-[#667085] font-normal">
                        Write prompt to generate your email description.
                      </p>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                disabled={isViewMode}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4">
                    <FormLabel className="md:text-sm col-span-1">Subject</FormLabel>
                    <div className="m-0 w-full col-span-3">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <SenderEmails isViewMode={isViewMode} senderEmailform={senderEmailform} />

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
                      />{' '}
                      <FormMessage className="w-full" />
                    </div>
                  </FormItem>
                )}
              />

              {(!isViewMode || !campaign?.leadgen_id) && (
                <FormField
                  control={form.control}
                  name="file"
                  disabled={isViewMode}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4">
                      <FormLabel className="min-w-170 col-span-1">Leads List</FormLabel>
                      <div className="m-0  w-full flex flex-col gap-1 col-span-3">
                        <p className="text-base text-[#667085] font-normal">
                          Upload your .csv file consisting of all your leads
                        </p>
                        <FormControl>
                          <div className="flex gap-3">
                            <SingleImageUpload
                              title={
                                isViewMode
                                  ? campaign?.file
                                    ? campaign?.file.slice(0, 30) + '...'
                                    : ''
                                  : file
                                    ? file.name
                                    : 'Upload here.'
                              }
                              onImageUpload={(file) => {
                                setFile(file[0]);
                                field.onChange(file);
                              }}
                              disabled={isViewMode}
                              className="h-[60px] max-w-[300px] w-fit   bg-white border  border-neutral-300 flex flex-row border-2"
                              titleClassName="text-sm text-ellipsis "
                              accept={{
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                  [],
                              }}
                            ></SingleImageUpload>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {!isViewMode && (
                <FormItem className="grid grid-cols-4">
                  <FormLabel className="md:text-sm col-span-1"></FormLabel>
                  <div className="m-0  w-full flex flex-col gap-1 col-span-3">
                    <Button
                      isLoading={createCampaign.isLoading || testCampaignEmails.isLoading}
                      disabled={senderEmailList.isLoading || isViewMode}
                      onClick={form.handleSubmit(onSubmit)}
                      className="capitalize w-fit bg-purple-500 text-white gap-3"
                    >
                      Review
                      <SendHorizontalIcon />
                    </Button>
                  </div>
                </FormItem>
              )}
              {selectAssistantOpen && (
                <SelectAssistantDialog
                  title="Assistant selection for leads generation"
                  description="Select an assistant for this leads to get started."
                  onSelectAssistant={(id: number) => {
                    setParams({ assistant_id: id.toString() }, { replace: true });
                    setSelectAssistantOpen(false);
                  }}
                  onCreateAssistant={() => {
                    navigate(routes.addAssistance + `?callbackUrl=${routes.campaignCreate}`);
                  }}
                  onClose={() => {
                    setSelectAssistantOpen(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
