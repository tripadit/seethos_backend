import { PageHeader } from '@/components/molecules';

import { CreateSequenceCampaignForm } from '../components/createCampaign/sequenceCampaignForm';

const CreateSequenceCampaign = () => {
  return (
    <div className="mb-20">
      <PageHeader title="Create a Sequence Campaign" children={undefined} />
      <CreateSequenceCampaignForm />
    </div>
  );
};
export default CreateSequenceCampaign;
