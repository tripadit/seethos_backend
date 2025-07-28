import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { DeleteIcon, SaveIcon, SearchNotFound } from '@/assets/icons';
import { DeleteLeadDialog } from '@/components/dialog/DeleteLeadDialog';
import { PageHeader } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import {
  useGetLeadMailHistory,
  usePatchLead,
  useSendEmailResponseToLead,
} from '../hooks/leadGeneration';
import EmailHistoryCard from './EmailHistoryCard';
import { ILead } from './LeadListDetails/LeadListDetails';

const PatchLeadFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  company_name: z.string(),
  position: z.string(),
  location: z.string(),
  summary: z.string(),
});

export type PatchLeadFormSchemaType = z.infer<typeof PatchLeadFormSchema>;

export default function LeadDetails({ lead: data }: { lead: ILead }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const edit = searchParams.get('edit');

  const id: string = params.id || '';

  const [emailResponse, setEmailResponse] = useState<string>('');

  const form = useForm<PatchLeadFormSchemaType>({
    resolver: zodResolver(PatchLeadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      company_name: '',
      position: '',
      location: '',
      summary: '',
    },
    mode: 'all',
  });

  useEffect(() => {
    if (edit === 'true') setIsEditMode(true);
  }, [edit]);

  const patchLead = usePatchLead();

  const sendEmailResponse = useSendEmailResponseToLead();

  const [emailBody, setEmailBody] = useState<{
    data?: any;
    isLoading?: boolean;
  }>({});

  const { data: mailHistory, isLoading } = emailBody;

  const getEmailHistory = useGetLeadMailHistory();

  useEffect(() => {
    if (id) {
      setEmailBody({ isLoading: true });
      getEmailHistory
        .mutateAsync(id)
        .then((res) => {
          setEmailBody({ data: res, isLoading: false });
        })
        .catch(() => {
          setEmailBody({ data: [], isLoading: false });
        });
    }
  }, [id]);

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    form.setValue('name', data?.name || '');
    form.setValue('email', data?.email || '');
    form.setValue('phone_number', data?.phone_number || '');
    form.setValue('company_name', data?.company_name || '');
    form.setValue('position', data?.position || '');
    form.setValue('location', data?.location || '');
    form.setValue('summary', data?.summary || '');
  }, [data]);

  const saveLead = async () => {
    const response = await patchLead.mutateAsync({
      id,
      body: form.getValues(),
    });
    if (response) setIsEditMode(false);
  };

  const sendResponse = async () => {
    if (mailHistory?.data?.length === 0) {
      return;
    }
    await sendEmailResponse.mutateAsync({
      parent: mailHistory?.data?.[0]?.id,
      body: emailResponse,
      from_email: mailHistory?.data?.find((item: any) => !!item.from_email)?.from_email || '',
      lead: id,
    });
    setEmailResponse('');
  };

  return (
    <div className="">
      <PageHeader title={'Lead: ' + (data?.name || '')}>
        {data?.leadGen && (
          <>
            {!isEditMode && (
              <div className="flex gap-4">
                <Button
                  variant={'outline'}
                  onClick={toggleDialog}
                  icon={<DeleteIcon className="h-5 w-5" />}
                >
                  Delete Lead
                </Button>
                <Button
                  variant={'purple'}
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                  icon={<Pen className="h-5 w-5" />}
                >
                  Edit Lead
                </Button>
              </div>
            )}
            {isEditMode && (
              <div className="flex gap-4">
                <Button
                  isLoading={patchLead.isLoading}
                  variant={'purple'}
                  onClick={saveLead}
                  icon={<SaveIcon />}
                >
                  Save
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    setIsEditMode(false);
                    form.setValue('name', data?.name || '');
                    form.setValue('email', data?.email || '');
                    form.setValue('phone_number', data?.phone_number || '');
                    form.setValue('company_name', data?.company_name || '');
                    form.setValue('position', data?.position || '');
                    form.setValue('location', data?.location || '');
                    form.setValue('summary', data?.summary || '');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
      </PageHeader>
      <div className="flex h-full flex-col md:flex-row flex-1 gap-6">
        <Form {...form}>
          <div className="p-6 flex border-r h-full flex-col gap-4 md:w-[421px]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex !flex-col">
                  <FormLabel>Name</FormLabel>
                  <Input {...field} disabled={!isEditMode} />
                  <FormMessage className="w-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex !flex-col">
                  <FormLabel>Email</FormLabel>
                  <Input {...field} disabled={!isEditMode} />
                  <FormMessage className="w-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="flex !flex-col">
                  <FormLabel>Phone Number</FormLabel>
                  <Input {...field} disabled={!isEditMode} />
                  <FormMessage className="w-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem className="flex !flex-col">
                  <FormLabel>Company Name</FormLabel>
                  <Input {...field} disabled={!isEditMode} />
                  <FormMessage className="w-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem className="flex !flex-col">
                  <FormLabel>Summary</FormLabel>
                  <Textarea
                    {...field}
                    rows={6}
                    placeholder=""
                    className="mb-2"
                    disabled={!isEditMode}
                  />
                  <FormMessage className="w-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex !flex-col">
                  <FormLabel>Location</FormLabel>
                  <Input {...field} disabled={!isEditMode} />
                  <FormMessage className="w-full" />
                </FormItem>
              )}
            />
          </div>
        </Form>
        {data?.campaign_id && (
          <div className="w-full flex-1">
            <div className="mb-4 mt-2 font-semibold">Email History</div>
            <ScrollArea
              className={cn(
                'h-[421px] pr-3',
                mailHistory?.data?.length === 0 && 'flex-1 h-[630px] ',
              )}
            >
              <div className="flex flex-col gap-[10px]">
                {mailHistory?.data?.map((item: any) => (
                  <EmailHistoryCard key={item.id} item={item} />
                ))}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center">
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="p-12 flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin" />
                      <p>Loading...</p>
                    </div>
                  </div>
                )}{' '}
                {!isLoading && mailHistory?.count === 0 && (
                  <div className="h-24 flex flex-col items-center">
                    <div className="flex mb-6 justify-center">
                      <SearchNotFound />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-700">No data found!</h4>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            {mailHistory?.data?.length !== 0 && data?.is_subscribed && (
              <Card className="my-4">
                <div className="flex  flex-col gap-3 p-4">
                  <div className="border-b border-[#344054] pb-2 w-fit">Manaul Reply</div>
                  <div className="relative">
                    <Textarea
                      rows={4}
                      value={emailResponse}
                      onChange={(event) => {
                        setEmailResponse(event.target.value);
                      }}
                      placeholder="Type your message here"
                    />
                    <Button
                      variant="purple"
                      className="absolute bottom-2 right-2"
                      disabled={!emailResponse}
                      onClick={sendResponse}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      <DeleteLeadDialog
        navigateToLeadList
        leadId={id}
        isOpen={isOpen}
        toggleDialog={toggleDialog}
      />
    </div>
  );
}
