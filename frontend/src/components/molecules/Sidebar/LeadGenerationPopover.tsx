import { useNavigate } from 'react-router-dom';

import { routes } from '@/routes/routes';

const PopoverMenu = [
  {
    title: 'Lead Generation',
    link: routes.leadGeneration,
  },
  {
    title: 'Lead List',
    link: routes.leadsList,
  },
];

export default function LeadGenerationPopover({ closePopover }: { closePopover: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 relative w-full">
      {PopoverMenu.map((item) => (
        <div
          className="text-sm text-white hover:bg-gray-800 cursor-pointer p-2 rounded w-full"
          onClick={() => {
            navigate(item.link);
            closePopover();
          }}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
}
