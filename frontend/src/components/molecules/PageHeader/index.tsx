import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export const PageHeader = ({
  title,
  subTitle,
  children,
  isLoading,
  isChildPage = false,
  onBackPress,
  separatorClassName,
  tiltleClassName,
}: {
  title: React.ReactNode;
  subTitle?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  isChildPage?: boolean;
  onBackPress?: () => void;
  separatorClassName?: string;
  tiltleClassName?: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      {!isLoading && isChildPage && (
        <div
          className="flex gap-2 my-5 items-center text-gray-700 cursor-pointer"
          onClick={() => (onBackPress ? onBackPress?.() : navigate(-1))}
        >
          <ArrowLeft className="w-5 h-5 font-bold text-gray-700" />
          Back
        </div>
      )}
      <div
        className={clsx(
          'flex flex-col md:flex-row gap-3  items-center justify-between',
          tiltleClassName,
        )}
      >
        {!isLoading && (
          <div>
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="text-gray-500 text-base">{subTitle}</p>
          </div>
        )}
        {isLoading && (
          <div>
            <Skeleton className="h-10 flex-2 w-32 mb-3" />
          </div>
        )}
        {!isLoading && children}
        {isLoading && (
          <div>
            <Skeleton className="h-10 flex-2 w-32 mb-3" />
          </div>
        )}
      </div>
      <Separator className={clsx('my-4', separatorClassName)} />
    </>
  );
};
