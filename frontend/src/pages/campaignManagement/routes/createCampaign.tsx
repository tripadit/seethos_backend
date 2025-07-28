import { PageHeader } from '@/components/molecules';

import { CreateCampaignForm } from '../components/createCampaign/form';

const CreateCampaign = () => {
  return (
    <div className="mb-20">
      <PageHeader title="Create a campaign" children={undefined} />
      <CreateCampaignForm />
    </div>
  );
};
export default CreateCampaign;
