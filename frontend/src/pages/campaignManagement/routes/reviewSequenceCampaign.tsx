import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { PageHeader } from '@/components/molecules';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast.ts';
import EmailSequenceCard from '@/pages/campaignManagement/components/EmailSequenceCard.tsx';
import { routes } from '@/routes/routes';

import { CreateSequenceCampaignForm } from '../components/createCampaign/sequenceCampaignForm';
import {
  useCreateSequenceMutation,
  useFetchSequenceByCampaignId,
  useFetchSequenceCampaignById,
  useRunSequenceCampaign,
  useUpdateSequenceMutation,
} from '../hooks/campaignManagement';

const patchEmailCampaignPromptSchema = z.object({
  reply_email: z.string().email('Please enter a valid email address').optional(),
  name: z.string({ required_error: 'Campaign name is required*' }),
});

type PatchEmailCampaignPrompt = z.infer<typeof patchEmailCampaignPromptSchema>;

interface EmailSequence {
  id?: number;
  subject: string;
  body: string;
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
}

export default function ReviewSequenceCampaign() {
  const params = useParams<{ id: string }>();

  const convertDelayToUnit = (delay: number, unit: 'minutes' | 'hours' | 'days'): number => {
    if (unit === 'minutes') return delay / 60;
    if (unit === 'hours') return delay / 3600;
    if (unit === 'days') return delay / (24 * 3600);
    return delay;
  };
  const { data: initialEmailSequence } = useFetchSequenceByCampaignId(params.id);

  const [emailSequence, setEmailSequence] = useState<EmailSequence[]>([
    { subject: '', body: '', delay: 1, delayUnit: 'days' },
    { subject: '', body: '', delay: 1, delayUnit: 'days' },
    { subject: '', body: '', delay: 1, delayUnit: 'days' },
  ]);

  useEffect(() => {
    if (initialEmailSequence?.data?.length === 0) return;
    setEmailSequence(
      initialEmailSequence?.data?.map((seq, index) => {
        let send_interval = seq.send_interval;
        if (index !== 0) {
          send_interval = send_interval - initialEmailSequence!.data[index - 1].send_interval;
        }

        return {
          ...seq,
          delayUnit:
            seq.send_interval % 86400 === 0
              ? 'days'
              : seq.send_interval % 3600 === 0
                ? 'hours'
                : 'minutes',
          delay:
            seq.send_interval % 86400 === 0
              ? convertDelayToUnit(send_interval, 'days')
              : seq.send_interval % 3600 === 0
                ? convertDelayToUnit(send_interval, 'hours')
                : convertDelayToUnit(send_interval, 'minutes'),
        };
      }) || [
        { subject: '', body: '', delay: 1, delayUnit: 'days' },
        { subject: '', body: '', delay: 1, delayUnit: 'days' },
        { subject: '', body: '', delay: 1, delayUnit: 'days' },
      ],
    );
  }, [initialEmailSequence]);

  const handleInputChange = (index: number, event: any) => {
    const { name, value } = event.target;
    const newEmailSequence = [...emailSequence];
    newEmailSequence[index] = {
      ...newEmailSequence[index],
      [name]: name === 'delay' ? Number(value) : value,
    };
    setEmailSequence(newEmailSequence);
  };

  const handleAddSequence = () => {
    setEmailSequence([...emailSequence, { subject: '', body: '', delay: 0, delayUnit: 'days' }]);
  };

  const handleRemoveSequence = (index: number) => {
    const newEmailSequence = emailSequence.filter((_, i) => i !== index);
    setEmailSequence(newEmailSequence);
  };

  const convertToSeconds = (delay: number, unit: 'minutes' | 'hours' | 'days'): number => {
    if (unit === 'minutes') return delay * 60;
    if (unit === 'hours') return delay * 3600;
    return delay * 86400;
  };

  const calculateTotalDelay = (index: number): number => {
    let totalDelay = 0;
    for (let i = 0; i <= index; i++) {
      totalDelay += convertToSeconds(emailSequence[i].delay, emailSequence[i].delayUnit);
    }
    return totalDelay;
  };

  const runEmailSequenceCampaign = useRunSequenceCampaign();
  const createEmailSequence = useCreateSequenceMutation();
  const updateEmailSequence = useUpdateSequenceMutation();

  const navigate = useNavigate();
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const isValid = emailSequence.every((sequence) => !!sequence.subject && sequence.body);
    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Subject and Body cannot be empty.',
      });
      return;
    }
    const emailSequenceWithTotalDelay = emailSequence.map((sequence, index) => ({
      ...sequence,
      totalDelayInSeconds: calculateTotalDelay(index),
    }));

    Promise.all(
      emailSequenceWithTotalDelay.map((sequence, index) => {
        if (sequence?.id) {
          updateEmailSequence.mutateAsync({
            id: sequence.id,
            subject: sequence.subject,
            body: sequence.body,
            order: index + 1,
            send_interval: sequence.totalDelayInSeconds,
          });
        } else {
          createEmailSequence.mutateAsync({
            campaign: params.id,
            subject: sequence.subject,
            body: sequence.body,
            order: index + 1,
            send_interval: sequence.totalDelayInSeconds,
          });
        }
      }),
    ).then(async () => {
      await runEmailSequenceCampaign.mutateAsync(Number(params.id));
      navigate(routes.sequenceCampaignDetail.replace(':id', params.id || '0'));
    });
  };

  const { isLoading, data } = useFetchSequenceCampaignById(params.id);

  const form = useForm<PatchEmailCampaignPrompt>({
    resolver: zodResolver(patchEmailCampaignPromptSchema),
  });

  if (data?.status !== 'Draft') {
    return <></>;
  }

  return (
    <div className="mb-20">
      <PageHeader title="Add Sequence"></PageHeader>
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
                    <CreateSequenceCampaignForm campaign={data} isViewMode gridCount={1} />
                    <FormItem className="grid grid-cols-4">
                      <FormLabel className="md:text-sm  col-span-1 "></FormLabel>
                      <div className="m-0 w-full flex gap-4  col-span-3">
                        {data?.status === 'Draft' && (
                          <Button
                            variant="purple"
                            isLoading={
                              runEmailSequenceCampaign.isLoading || createEmailSequence.isLoading
                            }
                            onClick={handleSubmit}
                          >
                            Start Campaign
                          </Button>
                        )}
                      </div>
                    </FormItem>
                  </div>
                  <ScrollArea className="h-email-sample shadow-qrCard rounded-lg border-gray-200 border p-6">
                    <form>
                      {emailSequence.map((sequence, index) => (
                        <EmailSequenceCard
                          index={index}
                          key={index}
                          sequence={sequence}
                          handleInputChange={handleInputChange}
                          handleRemoveSequence={handleRemoveSequence}
                          emailSequence={emailSequence}
                        />
                      ))}
                      <Button variant={'purple'} type="button" onClick={handleAddSequence}>
                        Add Sequence
                      </Button>
                    </form>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
}
