import { useMixpanel } from 'react-mixpanel-browser';
import { Link, useNavigate } from 'react-router-dom';

import { UserIcon } from '@/assets/icons';
import { LogoutDialog } from '@/components/dialog';
import { CreateBotFormStep } from '@/components/forms/AddBotForm/helpers';
import { Progress } from '@/components/ui/progress';
import { tokenConstants } from '@/global/appConstants';
import { cn, LANDING_CALENDLY_URL } from '@/lib/utils';
import { routes } from '@/routes/routes';
import { useStore } from '@/store/store';
import * as storage from '@/utils/storage';
import tokenService from '@/utils/token';

import { CTooltip } from '..';

export const Header = ({
  isDemoAccount,
  isFreeAccount,
}: {
  isDemoAccount: boolean;
  isFreeAccount: boolean;
}) => {
  const navigate = useNavigate();
  const mixpanel = useMixpanel();
  const botStep = useStore((state) => state.botStep);

  const handleLogout = () => {
    mixpanel.track('Log Out', {
      email: storage.get(tokenConstants.USER_DETAIL)?.email,
    });
    mixpanel.reset();
    tokenService.clearToken();

    storage.remove(tokenConstants.USER_DETAIL);

    navigate(routes.signIn);
  };

  return (
    <>
      <div
        className={cn(
          'h-header bg-white relative border-solid border-b-2 gap-10 top-0 z-10 w-full shadow-header py-3 px-8 flex items-center justify-between',
          { 'pt-[36px] h-header-with-tag': isDemoAccount || isFreeAccount },
        )}
      >
        {isDemoAccount && (
          <div className="bg-yellow-400 h-[36px] text-sm py-2 absolute top-0 w-full text-center left-0 rigt-0 flex items-center justify-center gap-3">
            <p> You are curently using the demo account, Upgrade to unlock full features. </p>
            <p
              className="underline cursor-pointer"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Unlock Now
            </p>
          </div>
        )}
        {isFreeAccount && (
          <div className="bg-yellow-400 h-[36px] text-sm py-2 absolute top-0 left-0 right-0 w-full text-center flex items-center justify-center gap-3">
            <p> You are curently using the free account, Upgrade to unlock full features. </p>
            <p
              className="underline cursor-pointer"
              onClick={() => window.open(LANDING_CALENDLY_URL, '_blank')}
            >
              Unlock Now
            </p>
          </div>
        )}
        <div className="pl-24 flex-1">
          {botStep !== undefined && (
            <div className="flex gap-3 items-center">
              <p className="text-[#353B47] min-w-[130px] font-bold">{CreateBotFormStep[botStep]}</p>
              <p className="text-[#353B47] font-bold">{(botStep + 1) * 25}%</p>
              <Progress value={(botStep + 1) * 25} className="w-[50%]" />
            </div>
          )}
        </div>
        <div className="flex gap-8">
          <CTooltip text="Profile">
            <Link to={routes.profile}>
              <UserIcon />
            </Link>
          </CTooltip>

          <LogoutDialog onConfirm={handleLogout} />
        </div>
      </div>
    </>
  );
};
