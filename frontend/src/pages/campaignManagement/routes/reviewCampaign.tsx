import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { useGetAllDomains } from '@/components/domains/hooks/hooks';
import { PageHeader } from '@/components/molecules';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import SelectAssistantDialog from '@/pages/assistant/components/selectAssistant/dialog';
import SelectedAssistant from '@/pages/assistant/components/selectAssistant/selectedAssistant';
import { ILead } from '@/pages/leadGeneration/components/LeadListDetails/LeadListDetails';
import {
  useGetLeadMailHistory,
  useGetLeadsByEmailCampaignId,
} from '@/pages/leadGeneration/hooks/leadGeneration';
import { routes } from '@/routes/routes';

import { addSenderEmailSchema, SenderEmailFormType } from '../components/createCampaign/form';
import { SenderEmails } from '../components/createCampaign/helper/senderEmails';
import {
  useFetchCampaignById,
  useGetSenderEmailList,
  usePatchCampaignMutation,
  useRunCampaign,
  useTestEmailCampaignEmail,
} from '../hooks/campaignManagement';

const patchEmailCampaignPromptSchema = z.object({
  prompt: z.string({ required_error: 'Prompt is required*' }),
  subject: z.string({ required_error: 'Subject is required*' }),
  reply_email: z
    .string()
    .refine((email: string) => {
      return email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
    }, 'Enter a valid email')
    .optional(),
});

type PatchEmailCampaignPrompt = z.infer<typeof patchEmailCampaignPromptSchema>;

export default function ReviewCampaign() {
  const params = useParams<{ id: string }>();

  const [searchParams, setParams] = useSearchParams();

  const assistant_id = searchParams.get('assistant_id') || '';
  const {
    isLoading,
    data,
    refetch: refetchCampaign,
  } = useFetchCampaignById(params.id, undefined, 5000);

  const patchCampaign = usePatchCampaignMutation();

  const [firstLoad, setFirstLoad] = useState(true);

  const navigate = useNavigate();

  const runCampaign = useRunCampaign();

  const form = useForm<PatchEmailCampaignPrompt>({
    resolver: zodResolver(patchEmailCampaignPromptSchema),
  });

  const { data: allDomains } = useGetAllDomains();

  const senderEmailList = useGetSenderEmailList();

  const validateEmail = (email: string) => {
    return (
      allDomains &&
      allDomains.data &&
      allDomains.data.some((domain: any) => {
        if (email.includes(domain.domain)) {
          return true;
        }
      })
    );
  };

  const [selectAssistantOpen, setSelectAssistantOpen] = useState(false);

  const senderEmailform = useForm<SenderEmailFormType>({
    resolver: zodResolver(addSenderEmailSchema(validateEmail)),
    defaultValues: {},
  });

  const testCampaignEmails = useTestEmailCampaignEmail();

  const { data: leadsByEmailCampaign, refetch: refetchLeads } = useGetLeadsByEmailCampaignId(
    params.id,
    !!data?.id,
    {
      pageIndex: 1,
      pageSize: 5,
    },
    undefined,
    {
      refetchInterval: 5000,
    },
  );

  const onSubmit = (formData: PatchEmailCampaignPrompt) => {
    if (senderEmailList.data?.data.length === 0) {
      senderEmailform.setError('email', { message: 'Please add atleast one sender email' });
      return;
    }
    patchCampaign.mutate({
      id: data!.id.toString(),
      body: {
        prompt: formData.prompt,
        subject: formData.subject,
        chatbot: assistant_id,
        reply_email: formData.reply_email,
      },
    });
    testCampaignEmails.mutate(data!.id.toString());
    refetchCampaign();
    setTimeout(() => {
      refetchLeads();
    }, 200);
  };

  const startCampaign = () => {
    runCampaign.mutate(data!.id);
    navigate(routes.campaignDetail.replace(':id', data!.id.toString()));
  };
  useEffect(() => {
    if (data && firstLoad) {
      form.setValue('prompt', data?.prompt || '');
      form.setValue('subject', data?.subject || '');
      form.setValue('reply_email', data?.reply_email || '');
      setFirstLoad(false);
      setParams({ assistant_id: data?.chatbot?.toString() || '' }, { replace: true });
    }
  }, [data]);

  if (data?.status !== 'Draft') {
    return <></>;
  }

  return (
    <div className="mb-20">
      <PageHeader title="Review Campaign"></PageHeader>
      {isLoading && (
        <div className="flex gap-4 flex-col items-center">
          <Loader2 className="animate-spin w-8 h-8" />
          <p>Loading...</p>
        </div>
      )}

      {!isLoading && data && (
        <>
          <Form {...form}>
            <div>
              <div className="flex flex-col  gap-5">
                <div className="grid grid-cols-2 gap-16 w-full">
                  <div className="flex flex-col gap-4">
                    <SelectedAssistant
                      onClickChange={() => {
                        setSelectAssistantOpen(true);
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4">
                          <FormLabel className="md:text-sm col-span-1">Email Prompt</FormLabel>
                          <div className="m-0 w-full flex flex-col gap-1 col-span-3">
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
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4">
                          <FormLabel className="md:text-sm col-span-1 ">Subject</FormLabel>
                          <div className="m-0 w-full  col-span-3">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <SenderEmails isViewMode={false} senderEmailform={senderEmailform} />

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
                    <FormItem className="grid grid-cols-4">
                      <FormLabel className="md:text-sm  col-span-1 "></FormLabel>
                      <div className="m-0 w-full flex gap-4  col-span-3">
                        <Button
                          variant="outline"
                          isLoading={patchCampaign.isLoading}
                          onClick={form.handleSubmit(onSubmit)}
                          className="capitalize w-fit gap-3"
                        >
                          Update
                        </Button>
                        {data?.status === 'Draft' && (
                          <Button variant="purple" onClick={startCampaign}>
                            Start Campaign
                          </Button>
                        )}
                      </div>
                    </FormItem>
                  </div>
                  <div className="h-email-sample">
                    {leadsByEmailCampaign && leadsByEmailCampaign?.data.length > 0 && (
                      <div className="mt-10 shadow-qrCard rounded-lg border-gray-200 border p-6">
                        <h2 className="text-lg font-semibold mb-1 ">Email Samples</h2>
                        <p className="text-gray-600 text-sm mb-4">
                          Here are some email samples based on your inputs. You can further tweak
                          your prompt details and update to get better results as required.
                        </p>
                        <ScrollArea className="flex flex-col gap-4 max-h-email-sample h-email-sample">
                          {leadsByEmailCampaign?.data.map((lead: ILead, index: number) => (
                            <EmailSampleForLead key={index} index={index} lead={lead} />
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                    {!data?.is_sample_generated && (
                      <div className="flex gap-4 mt-10 flex-col items-center text-center">
                        <Loader2 className="animate-spin w-8 h-8" />
                        <p>
                          Generating Sample Emails ...
                          <br />
                          <p className='"text-sm text-gray-500'>
                            This may take a while. Please wait.
                          </p>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
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
  );
}

const EmailSampleForLead = ({ lead, index }: { lead: ILead; index: number }) => {
  const [emailBody, setEmailBody] = useState<{
    data?: any;
    isLoading?: boolean;
  }>({});

  const { data: mailHistory } = emailBody;

  const getEmailHistory = useGetLeadMailHistory();

  useEffect(() => {
    if (lead.id) {
      setEmailBody({ isLoading: true });
      getEmailHistory.mutateAsync(lead.id.toString()).then((res) => {
        setEmailBody({ data: res, isLoading: false });
      });
    }
  }, [lead.id]);

  return (
    <div className="">
      {mailHistory?.data?.map((item: any) => (
        <div key={item.id} className="  flex flex-col gap-2 py-4 rounded-md">
          <div className="text-primary-muted font-medium">Sample {index + 1}</div>
          <div className="flex flex-col w-full justify-between border border-gray-200 p-5 rounded-lg shadow-qrCard text-gray-700">
            <div>
              {' '}
              <span className="text-sm font-medium mr-1 text-gray-600">To:</span>
              <span>{lead.primary_email}</span>
            </div>

            <Separator className={'my-3'} />

            <div>
              {' '}
              <span className="text-sm font-medium mr-1 text-gray-600">From:</span>
              <span>{item.from_email}</span>
            </div>

            <Separator className={'my-3'} />

            <div className="font-semibold">
              <span className="text-sm font-medium mr-1 text-gray-600">Subject:</span>
              <span>{item.subject}</span>
            </div>

            <Separator className={'my-3'} />

            <div>
              <span dangerouslySetInnerHTML={{ __html: item.body }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
