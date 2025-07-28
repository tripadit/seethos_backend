// import { VerticalDotsIcon } from '@/assets/icons';
import { ArrowDown, MoreHorizontal } from 'lucide-react';

import { ChartDownIcon, ChartGrowIcon, GreenUpArrowIcon } from '@/assets/icons';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { parseFloatValue } from '@/lib/utils';

interface IDashboardCard {
  title?: string;
  count?: string | number;
  growth?: number;
  isLoading?: boolean;
  hasGrowthCount?: boolean;
  showRightIcon?: boolean;
  showRightChartIcon?: boolean;
  hasFallCount?: boolean;
  fall?: number;
}

export const DashboardCard = ({
  title,
  count,
  isLoading,
  growth,
  hasGrowthCount,
  hasFallCount = false,
  showRightIcon = false,
  showRightChartIcon = false,
  fall,
}: IDashboardCard) => {
  return (
    <Card className="p-4 w-306 min-w-[306px] flex flex-col gap-2.5 shadow-card">
      {isLoading && (
        <div className="flex h-full flex-col justify-between">
          <div className="">
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      )}
      {!isLoading && (
        <div className="cursor-pointer flex flex-row justify-between flex-1">
          <div className="flex flex-col flex-1 justify-between gap-4">
            <div className="flex items-center justify-between ">
              <p className="text-base font-normal">{title}</p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold">
                {typeof count === 'number' ? parseFloatValue(count) : count}
              </h2>
            </div>

            {hasGrowthCount && (
              <div className="flex items-center min-w-fit gap-1">
                <GreenUpArrowIcon />
                <p className="text-success-500">{parseFloatValue(growth)}%</p>
                <p>vs last day</p>
              </div>
            )}
            {hasFallCount && (
              <div className="flex items-center min-w-fit gap-1">
                <ArrowDown className="text-red-500" />
                <p className="text-red-500">{parseFloatValue(fall)}%</p>
                <p>vs last day</p>
              </div>
            )}
          </div>
          {(showRightIcon || showRightChartIcon) && (
            <div className="flex flex-col justify-between items-end">
              {showRightIcon && (
                <div>
                  <MoreHorizontal className="rotate-90" />
                </div>
              )}
              {showRightChartIcon && hasGrowthCount && <ChartGrowIcon />}
              {showRightChartIcon && hasFallCount && <ChartDownIcon />}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
