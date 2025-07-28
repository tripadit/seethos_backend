import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  usePatchCampaignMutation,
  usePatchSequenceCampaignMutation,
} from '@/pages/campaignManagement/hooks/campaignManagement';

export default function EnableDisableAutoReply({
  campaign,
  isSequenceCampaign,
}: {
  campaign: any;
  isSequenceCampaign?: boolean;
}) {
  const [showDialog, setShowDialog] = useState(false);

  const patchSequenceCampaign = usePatchSequenceCampaignMutation();

  const patchEmailCampaign = usePatchCampaignMutation();

  const toggleAutoReply = () => {
    if (isSequenceCampaign) {
      patchSequenceCampaign.mutate({
        id: campaign.id,
        body: {
          auto_reply: !campaign.auto_reply,
        },
      });
      setShowDialog(false);
      return;
    }
    patchEmailCampaign.mutate({
      id: campaign.id,
      body: {
        auto_reply: !campaign.auto_reply,
      },
    });
    setShowDialog(false);
  };

  return (
    <>
      <Button
        variant="purple"
        onClick={() => {
          setShowDialog(true);
        }}
      >
        {campaign.auto_reply ? 'Disable Auto Response' : 'Enable Auto Response'}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle> {campaign.auto_reply ? 'Disable' : 'Enable'} Auto Response?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toggleAutoReply();
                  setShowDialog(false);
                }}
              >
                {campaign.auto_reply ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
