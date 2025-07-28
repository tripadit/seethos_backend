import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { ChatIcon, HomeIcon, SettingIcon, StatisticsIcon, TrainingIcon } from '@/assets/icons';
import { CTooltip, SearchInput } from '@/components/molecules';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';

import { useGetEmailNotifications } from './hooks';
import LeadGenerationPopover from './LeadGenerationPopover';

interface IMenu {
  title: React.ReactNode | string;
  path: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | LucideIcon;
  open?: boolean;
  id?: string;
  isActionButton?: boolean;
}

const Menus: IMenu[] = [
  { title: 'Dashboard', path: routes.dashboard, icon: HomeIcon, id: 'dashboard' },
  { title: 'Analytics', path: routes.analytics, icon: StatisticsIcon, id: 'analytics' },
  { title: 'Assistant Trainings', path: routes.training, icon: TrainingIcon, id: 'bot-training' },
  { title: 'Conversations', path: routes.conversations, icon: ChatIcon, id: 'conversations' },
  // { title: 'Analytics', path: '/analytics', icon: UsersIcon },
];

const BottomMenu: IMenu[] = [{ title: 'Setting', path: '/dashboard/setting', icon: SettingIcon }];
export const Sidebar = () => {
  const [open] = useState(true);

  const emailNotifications = useGetEmailNotifications();

  return (
    <div className="flex">
      <div
        className={cn(
          'bg-dark-purple h-screen p-4 flex-col flex-1 pt-8 relative duration-300 bg-[#101828]',
          {
            'w-72 flex flex-col ': open,
            'w-20 flex ': !open,
          },
        )}
      >
        {/** toggle */}
        {/* <div className="absolute -right-3 top-70 w-[28px] h-[28px]">
          <CRightIcon
            className={` w-full h-full fill-white bg-[#101828] p-1 cursor-pointer border-white
           border-2 rounded-full  ${open && 'rotate-180'}`}
            onClick={() => setOpen(!open)}
          />
        </div> */}

        {/** logo */}
        <div className={`flex ${!open && 'gap-x-0 justify-center'}  gap-x-4 items-center`}>
          <Link to="/dashboard" className="flex gap-4">
            <img src="/logo.png" className=" object-contain cursor-pointer duration-500" />
          </Link>
        </div>

        <SearchInput
          onSearch={() => {}}
          className={cn('w-full bg-transparent text-gray-50', { hidden: true })}
          inputClassName="bg-gray-700 border-none focus-visible:ring-inset"
        />

        {/** menus */}
        <div className="flex flex-col justify-between flex-1 pb-10">
          <ul className={cn('flex flex-col', { 'gap-3 mt-14 ': !open, 'gap-y-1 ': open })}>
            {Menus.map((menu) => (
              <div className="flex gap-2">
                <MenuItem key={menu.id} {...menu} open={open} />
                {menu.id == 'campaign-management' &&
                  emailNotifications &&
                  (emailNotifications?.data?.unread_emails || 0) > 0 && (
                    <div className="relative">
                      <div
                        className={cn(
                          'p-1 absolute -left-6 h-2.5 w-2.5 text-white font-bold top-2 text-[8px] rounded-full',
                          'bg-red-600',
                        )}
                      >
                        {/* {emailNotifications?.data?.unread_emails} */}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </ul>

          <ul className={cn('flex flex-col', { 'gap-3 mt-14 ': !open, 'gap-y-1 ': open })}>
            {BottomMenu.map((menu, index) => (
              <MenuItem key={'sub' + index} {...menu} open={open} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ title, path, icon: Icon, open, id, isActionButton }: IMenu) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isPopoverOpen, setOpen] = useState(false);

  if (isActionButton) {
    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={() => {
          setOpen(!isPopoverOpen);
        }}
      >
        <PopoverTrigger asChild>
          <li
            id={id}
            className={cn(
              'grid grid-cols-[20px_1fr] rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4',
              {
                'bg-gray-800 flex justify-center h-sidebar-close': !open,
                'h-10 px-4': open,
                'bg-gray-600': location.pathname === path,
              },
            )}
          >
            <Icon />
            <span
              className={`${
                !open && 'hidden'
              } origin-left duration-200 text-sm font-medium text-gray-100`}
            >
              {title}
            </span>
          </li>
        </PopoverTrigger>
        <PopoverContent align="start" side="right" className="bg-gray-900 ml-5 w-fit border-0 p-3">
          <LeadGenerationPopover
            closePopover={() => {
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <CTooltip
      isShowArrow
      arrowClasName="fill-gray-900"
      sideOffset={20}
      side="right"
      text={title}
      className="bg-gray-900 text-white border-none h-10 flex flex-1 flex-row items-center"
    >
      <li
        id={id}
        className={cn(
          'grid grid-cols-[20px_1fr] rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4',
          {
            'bg-gray-800 flex justify-center h-sidebar-close': !open,
            'h-10 px-4': open,
            'bg-gray-600': location.pathname === path,
          },
        )}
        onClick={() => {
          if (!isActionButton) {
            navigate(path);
          }
        }}
      >
        <Icon />
        <span
          className={`${
            !open && 'hidden'
          } origin-left duration-200 text-sm font-medium text-gray-100`}
        >
          {title}
        </span>
      </li>
    </CTooltip>
  );
};
