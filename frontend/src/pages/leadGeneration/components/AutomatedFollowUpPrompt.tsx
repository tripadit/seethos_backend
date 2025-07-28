import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { CustomDialog } from '@/components/dialog/CustomDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePatchCampaignMutation } from '@/pages/campaignManagement/hooks/campaignManagement';

const schema = z.object({
  followUpPrompt: z.string().nonempty('Follow-up prompt is required'),
});

export default function AutomatedFollowUpPrompt({ id }: { id: string }) {
  const [showEmailPromptDialog, setShowEmailPromptDialog] = useState(false);

  const patchEmailCampaign = usePatchCampaignMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: { followUpPrompt?: any }) => {
    patchEmailCampaign.mutate({
      id: id,
      body: {
        follow_up_prompt: data.followUpPrompt || '',
        auto_reply: true,
      },
    });
    setShowEmailPromptDialog(false);
  };

  return (
    <>
      <Button
        variant="outline"
        icon={<PlusIcon />}
        onClick={() => {
          setShowEmailPromptDialog(true);
        }}
      >
        Send Automated Response
      </Button>

      <CustomDialog
        title="Send automated response"
        isOpen={showEmailPromptDialog}
        onClose={() => setShowEmailPromptDialog(false)}
        body={
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <div>Auto response prompt</div>
              <Textarea
                {...register('followUpPrompt')}
                className=""
                placeholder="Enter a prompt to generate a automated response to the user."
              />

              {errors.followUpPrompt && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.followUpPrompt.message?.toString()}
                </p>
              )}
              <div className="flex w-full mt-2 items-center justify-end">
                <Button type="submit" variant="purple" isLoading={patchEmailCampaign.isLoading}>
                  Add prompt
                </Button>
              </div>
            </form>
          </>
        }
      />
    </>
  );
}
