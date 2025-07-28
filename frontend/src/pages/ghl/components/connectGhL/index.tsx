import { GHLImage } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetCurrentUserInfo } from '@/hooks/api';

import { useConnectGHL, useDisconnectGHL } from '../../hooks/ghl';

export const ConnectGHL = () => {
  const currentUser = useGetCurrentUserInfo();
  const connect = useConnectGHL();
  const disconnect = useDisconnectGHL();
  const handleConnectGHL = async () => {
    const res = await connect.mutateAsync();
    if (res?.link) {
      window.open(res.link, '_blank');
    }
  };
  const isConnect = currentUser.data?.data?.is_ghl_connected;

  return (
    <Card className="p-4 max-w-[998px] w-full">
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <img src={GHLImage} alt="GHL" className="" />
          <div className="flex flex-col text-xl text-black/70 font-bold">
            <h1>Streamline Your Workflow by Connecting Your Go High Level</h1>
            <p className="text-base font-normal text-[#667085]">
              Unlock the power of integration by seamlessly syncing your Go High Level CRM account
              with our existing dashboard.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {!isConnect ? (
            <>
              <div className="flex flex-row gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <p className="text-sm text-[#4F4F4F] font-medium">Disconnected</p>
              </div>
              <Button
                onClick={handleConnectGHL}
                className=""
                variant={'purple'}
                isLoading={connect.isLoading}
              >
                Connect
              </Button>
            </>
          ) : (
            <>
              <div className="flex flex-row gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-success-500"></div>
                <p className="text-sm text-[#4F4F4F] font-medium">Connected</p>
              </div>
              <Button
                onClick={() => disconnect.mutate()}
                className=""
                variant={'purple'}
                isLoading={disconnect.isLoading}
              >
                Disconnect
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
