import { PageHeader } from '@/components/molecules';
import { useRouteQuery } from '@/hooks';

import { ConnectGHL } from '../components/connectGhL';
import { useVerifyConnectGHL } from '../hooks/ghl';

const GoHighLevel = () => {
  const code = useRouteQuery('code');
  const verify = useVerifyConnectGHL();

  return (
    <div className="mb-20">
      <PageHeader title="Sync Your accounts" children={undefined} />
      {((!verify.isLoading && code) || !code) && (
        <div className="">
          <ConnectGHL />
        </div>
      )}
    </div>
  );
};

export default GoHighLevel;
